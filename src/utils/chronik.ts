import BCHJS from '@bcpros/xpi-js';
import { currency } from '@components/Common/Ticker';
import { walletAdapter, WalletState } from '@local-store/wallet';
import BigNumber from 'bignumber.js';
import { ChronikClient, Tx, TxHistoryPage, Utxo } from 'chronik-client';

import { Hash160AndAddress } from '@models/index';
import { decryptOpReturnMsg, getHashArrayFromWallet, getUtxoWif, parseOpReturn } from './cashMethods';
import { parseBurnOutput, ParseBurnResult } from './opReturnBurn';

export interface ParsedChronikTx {
  incoming: boolean;
  xpiAmount: string;
  originatingHash160: string;
  opReturnMessage: string;
  isLotusMessage: boolean;
  isEncryptedMessage: boolean;
  decryptionSuccess: boolean;
  replyAddress: string;
  destinationAddress: string;
  // Burn
  isBurn: boolean;
  burnInfo?: ParseBurnResult;
  xpiBurnAmount: string;
}

const getWalletPathsFromWalletState = (wallet: WalletState) => {
  return Object.entries(wallet.entities).map(([key, value]) => {
    return value;
  });
};

const getSelectedWalletPathFromWalletState = (wallet: WalletState) => {
  let selectedPath;
  Object.entries(wallet.entities).map(([key, value]) => {
    if (wallet.selectedWalletPath === key) {
      selectedPath = value;
    }
  });

  return selectedPath;
};

/* 
Note: chronik.script('p2pkh', hash160).utxos(); is not readily mockable in jest
Hence it is necessary to keep this out of any functions that require unit testing
*/
export const getUtxosSingleHashChronik = async (chronik: ChronikClient, hash160: string): Promise<Array<Utxo>> => {
  // Get utxos at a single address, which chronik takes in as a hash160
  let utxos;
  try {
    utxos = await chronik.script('p2pkh', hash160).utxos();
    if (utxos.length === 0) {
      // Chronik returns an empty array if there are no utxos at this hash160
      return [];
    }
    /* Chronik returns an array of with a single object if there are utxos at this hash 160
    [
        {
            outputScript: <hash160>,
            utxos:[{utxo}, {utxo}, ..., {utxo}]
        }
    ]
    */

    // Return only the array of utxos at this address
    return utxos[0].utxos;
  } catch (err) {
    console.log(`Error in chronik.utxos(${hash160})`, err);
  }
};

export const returnGetUtxosChronikPromise = (
  chronik: ChronikClient,
  hash160AndAddressObj: Hash160AndAddress
): Promise<Array<Utxo & { address: string }>> => {
  /*
      Chronik thinks in hash160s, but people and wallets think in addresses
      Add the address to each utxo
  */
  return new Promise((resolve, reject) => {
    getUtxosSingleHashChronik(chronik, hash160AndAddressObj.hash160).then(
      result => {
        if (!result) reject();
        for (let i = 0; i < result.length; i += 1) {
          const thisUtxo = result[i];
          (thisUtxo as any).address = hash160AndAddressObj.address;
        }
        resolve(result as Array<Utxo & { address: string }>);
      },
      err => {
        reject(err);
      }
    );
  });
};

export const getUtxosChronik = async (
  chronik: ChronikClient,
  hash160sMappedToAddresses: Array<Hash160AndAddress>
): Promise<Array<Utxo & { address: string }>> => {
  /* 
      Chronik only accepts utxo requests for one address at a time
      Construct an array of promises for each address
      Note: Chronik requires the hash160 of an address for this request
  */
  if (!chronik || !hash160sMappedToAddresses) return [];

  const chronikUtxoPromises: Array<Promise<Array<Utxo & { address: string }>>> = [];
  for (let i = 0; i < hash160sMappedToAddresses.length; i += 1) {
    const thisPromise = returnGetUtxosChronikPromise(chronik, hash160sMappedToAddresses[i]);
    chronikUtxoPromises.push(thisPromise);
  }
  const allUtxos = await Promise.all(chronikUtxoPromises);
  // Since each individual utxo has address information, no need to keep them in distinct arrays
  // Combine into one array of all utxos
  const flatUtxos = allUtxos.flat();
  return flatUtxos;
};

export const organizeUtxosByType = (
  chronikUtxos: Array<Utxo & { address: string }>
): { nonSlpUtxos: Array<Utxo & { address: string }> } => {
  /* 
  Convert chronik utxos (returned by getUtxosChronik function, above) to match 
  shape of existing slpBalancesAndUtxos object
  */

  const nonSlpUtxos = [];
  for (let i = 0; i < chronikUtxos.length; i += 1) {
    // Construct nonSlpUtxos and slpUtxos arrays
    const thisUtxo = chronikUtxos[i];
    if (typeof thisUtxo.slpToken !== 'undefined') {
    } else {
      nonSlpUtxos.push(thisUtxo);
    }
  }

  return { nonSlpUtxos };
};

export const flattenChronikTxHistory = (txHistoryOfAllAddresses: TxHistoryPage[]): Tx[] => {
  // Create an array of all txs

  let flatTxHistoryArray: Tx[] = [];
  for (let i = 0; i < txHistoryOfAllAddresses.length; i += 1) {
    const txHistoryResponseOfThisAddress = txHistoryOfAllAddresses[i];
    const txHistoryOfThisAddress = txHistoryResponseOfThisAddress.txs;
    flatTxHistoryArray = flatTxHistoryArray.concat(txHistoryOfThisAddress);
  }
  return flatTxHistoryArray;
};

// @todo
export const sortAndTrimChronikTxHistory = (flatTxHistoryArray: Tx[], txHistoryCount: number): Tx[] => {
  // Isolate unconfirmed txs
  // In chronik, unconfirmed txs have an `undefined` block key
  const unconfirmedTxs = [];
  const confirmedTxs = [];
  for (let i = 0; i < flatTxHistoryArray.length; i += 1) {
    const thisTx = flatTxHistoryArray[i];
    if (typeof thisTx.block === 'undefined') {
      unconfirmedTxs.push(thisTx);
    } else {
      confirmedTxs.push(thisTx);
    }
  }
  // Sort confirmed txs by blockheight, and then timeFirstSeen
  const sortedConfirmedTxHistoryArray = confirmedTxs.sort(
    (a, b) =>
      // We want more recent blocks i.e. higher blockheights to have earlier array indices
      b.block.height - a.block.height ||
      // For blocks with the same height, we want more recent timeFirstSeen i.e. higher timeFirstSeen to have earlier array indices
      b.timeFirstSeen - a.timeFirstSeen
  );
  // Sort unconfirmed txs by timeFirstSeen
  const sortedUnconfirmedTxHistoryArray = unconfirmedTxs.sort((a, b) => b.timeFirstSeen - a.timeFirstSeen);
  // The unconfirmed txs are more recent, so they should be inserted into an array before the confirmed txs
  const sortedChronikTxHistoryArray = sortedUnconfirmedTxHistoryArray.concat(sortedConfirmedTxHistoryArray);

  const trimmedAndSortedChronikTxHistoryArray = sortedChronikTxHistoryArray.splice(0, txHistoryCount);

  return trimmedAndSortedChronikTxHistoryArray;
};

export const returnGetTxHistoryChronikPromise = (
  chronik: ChronikClient,
  hash160AndAddressObj: Hash160AndAddress
): Promise<TxHistoryPage> => {
  /*
      Chronik thinks in hash160s, but people and wallets think in addresses
      Add the address to each utxo
  */
  return new Promise((resolve, reject) => {
    chronik
      .script('p2pkh', hash160AndAddressObj.hash160)
      .history(/*page=*/ 0, /*page_size=*/ currency.txHistoryCount)
      .then(
        result => {
          resolve(result);
        },
        err => {
          reject(err);
        }
      );
  });
};

export const getRecipientPublicKey = async (
  XPI: BCHJS,
  chronik: ChronikClient,
  recipientAddress: string,
  optionalMockPubKeyResponse: string | false = false
): Promise<string | false> => {
  // Necessary because jest can't mock
  // chronikTxHistoryAtAddress = await chronik.script('p2pkh', recipientAddressHash160).history(/*page=*/ 0, /*page_size=*/ 10);
  if (optionalMockPubKeyResponse) {
    return optionalMockPubKeyResponse;
  }

  // get hash160 of address
  let recipientAddressHash160: string;
  try {
    recipientAddressHash160 = XPI.Address.toHash160(recipientAddress);
  } catch (err) {
    console.log(`Error determining XPI.Address.toHash160(${recipientAddress} in getRecipientPublicKey())`, err);
    // throw new Error(`Error determining XPI.Address.toHash160(${recipientAddress} in getRecipientPublicKey())`);
  }

  let chronikTxHistoryAtAddress: TxHistoryPage;
  try {
    // Get 20 txs. If no outgoing txs in those 20 txs, just don't send the tx
    chronikTxHistoryAtAddress = await chronik
      .script('p2pkh', recipientAddressHash160)
      .history(/*page=*/ 0, /*page_size=*/ 20);
  } catch (err) {
    console.log(`Error getting await chronik.script('p2pkh', ${recipientAddressHash160}).history();`, err);
    throw new Error('Error fetching tx history to parse for public key');
  }

  let recipientPubKeyChronik;

  // Iterate over tx history to find an outgoing tx
  for (let i = 0; i < chronikTxHistoryAtAddress.txs.length; i += 1) {
    const { inputs } = chronikTxHistoryAtAddress.txs[i];
    for (let j = 0; j < inputs.length; j += 1) {
      const thisInput = inputs[j];
      const thisInputSendingHash160 = thisInput.outputScript;
      if (thisInputSendingHash160.includes(recipientAddressHash160)) {
        // Then this is an outgoing tx, you can get the public key from this tx
        // Get the public key
        try {
          recipientPubKeyChronik = chronikTxHistoryAtAddress.txs[i].inputs[j].inputScript.slice(-66);
        } catch (err) {
          throw new Error('Cannot send an encrypted message to a wallet with no outgoing transactions');
        }
        return recipientPubKeyChronik;
      }
    }
  }
  // You get here if you find no outgoing txs in the chronik tx history
  throw new Error('Cannot send an encrypted message to a wallet with no outgoing transactions in the last 20 txs');
};

export const parseChronikTx = async (
  XPI: BCHJS,
  chronik: ChronikClient,
  tx: Tx,
  wallet: WalletState
): Promise<ParsedChronikTx> => {
  const walletHash160s: string[] = getHashArrayFromWallet(wallet);
  const { inputs, outputs } = tx;
  // Assign defaults
  let incoming = true;
  let xpiAmount = new BigNumber(0);
  let originatingHash160 = '';

  // Burn
  let isBurn = false;
  let xpiBurnAmount = new BigNumber(0);
  let parseBurnResult;

  // Initialize required variables
  let messageHex = '';
  let opReturnMessage: string;
  let isLotusMessage = false;
  let isEncryptedMessage = false;
  let decryptionSuccess = false;
  let replyAddress = ''; // or senderAddress
  let destinationAddress = '';

  // Iterate over inputs to see if this is an incoming tx (incoming === true)
  for (let i = 0; i < inputs.length; i += 1) {
    const thisInput = inputs[i];
    const thisInputSendingHash160 = thisInput.outputScript;

    try {
      const legacyReplyAddress = XPI.Address.fromOutputScript(Buffer.from(thisInput.outputScript, 'hex'));
      replyAddress = XPI.Address.toXAddress(legacyReplyAddress);
    } catch (err) {
      console.log(`err from ${originatingHash160}`, err);
      // If the transaction is nonstandard, don't worry about a reply address for now
      originatingHash160 = 'N/A';
    }

    // Incoming transaction means that all inputs are not from current addresses
    for (let j = 0; j < walletHash160s.length; j += 1) {
      const thisWalletHash160 = walletHash160s[j];
      if (thisInputSendingHash160.includes(thisWalletHash160)) {
        // Then this is an outgoing tx
        incoming = false;
        // Break out of this for loop once you know this is an outgoing tx
        break;
      }
    }
  }

  // Iterate over outputs to get the amount sent
  for (let i = 0; i < outputs.length; i += 1) {
    const thisOutput = outputs[i];
    const thisOutputReceivedAtHash160 = thisOutput.outputScript;
    // Check for OP_RETURN msg
    if (thisOutput.value === '0' && typeof thisOutput.slpToken === 'undefined') {
      const hex = thisOutputReceivedAtHash160;
      const parsedOpReturnArray = parseOpReturn(hex);

      if (!parsedOpReturnArray) {
        console.log('parseChronikTx() error: parsed array is empty');
        break;
      }

      const txType = parsedOpReturnArray[0];

      if (txType === currency.opReturn.appPrefixesHex.lotusChat) {
        // this is a sendlotus message
        try {
          messageHex = parsedOpReturnArray[1];
          isLotusMessage = true;
          opReturnMessage = Buffer.from(messageHex, 'hex').toString();
        } catch (err) {
          // soft error if an unexpected or invalid cashtab hex is encountered
          opReturnMessage = '';
          console.log('useBCH.parsedTxData() error: invalid cashtab msg hex: ' + parsedOpReturnArray[1]);
        }
      } else if (txType === currency.opReturn.appPrefixesHex.lotusChatEncrypted) {
        isLotusMessage = true;
        isEncryptedMessage = true;
        messageHex = parsedOpReturnArray[1];
      } else {
        // this is an externally generated message
        messageHex = txType; // index 0 is the message content in this instance

        // if there are more than one part to the external message
        const arrayLength = parsedOpReturnArray.length;
        for (let i = 1; i < arrayLength; i++) {
          messageHex = messageHex + parsedOpReturnArray[i];
        }
      }
    }

    // Check OP_RETURN burn
    if (!isLotusMessage && thisOutputReceivedAtHash160.startsWith('6a')) {
      isBurn = true;
      xpiBurnAmount = new BigNumber(thisOutput.value);
      parseBurnResult = parseBurnOutput(thisOutputReceivedAtHash160);
    }
    // Find amounts at your wallet's addresses
    for (let j = 0; j < walletHash160s.length; j += 1) {
      const thisWalletHash160 = walletHash160s[j];
      if (thisOutputReceivedAtHash160.includes(thisWalletHash160)) {
        // If incoming tx, this is amount received by the user's wallet
        // if outgoing tx (incoming === false), then this is a change amount
        const thisOutputAmount = new BigNumber(thisOutput.value);
        xpiAmount = incoming ? xpiAmount.plus(thisOutputAmount) : xpiAmount.minus(thisOutputAmount);
      }
    }
    // Output amounts not at your wallet are sent amounts if !incoming
    if (!incoming) {
      const thisOutputAmount = new BigNumber(thisOutput.value);
      xpiAmount = xpiAmount.plus(thisOutputAmount);
      try {
        if (!destinationAddress) {
          // Assumpt the destination address is the first output
          const legacyDestinationAddress = XPI.Address.fromOutputScript(Buffer.from(thisOutput.outputScript, 'hex'));
          destinationAddress = XPI.Address.toXAddress(legacyDestinationAddress);
        }
      } catch (err) {}
    }
  }

  // Convert from sats to XPI
  xpiAmount = xpiAmount.shiftedBy(-1 * currency.cashDecimals);
  if (isBurn) {
    xpiBurnAmount = xpiBurnAmount.shiftedBy(-1 * currency.cashDecimals);
  }
  // Convert from BigNumber to string
  const xpiAmountString = xpiAmount.toString();
  const xpiBurnAmountString = xpiBurnAmount.toString();

  // Convert messageHex to string
  const theOtherAddress = incoming ? replyAddress : destinationAddress;
  let otherPublicKey;
  try {
    otherPublicKey = await getRecipientPublicKey(XPI, chronik, theOtherAddress);
  } catch (err) {}

  if (
    isLotusMessage &&
    isEncryptedMessage &&
    theOtherAddress &&
    otherPublicKey &&
    wallet &&
    wallet.walletStatus &&
    wallet.walletStatus.slpBalancesAndUtxos &&
    wallet.walletStatus.slpBalancesAndUtxos.nonSlpUtxos[0]
  ) {
    const { selectAll } = walletAdapter.getSelectors();
    // const allWalletPaths = Object.values(wallet.entities);
    const allWalletPaths = selectAll(wallet);
    const fundingWif = getUtxoWif(wallet.walletStatus.slpBalancesAndUtxos.nonSlpUtxos[0], allWalletPaths);
    const decryption = await decryptOpReturnMsg(messageHex, fundingWif, otherPublicKey);

    if (decryption.success) {
      opReturnMessage = Buffer.from(decryption.decryptedMsg).toString('utf8');
      decryptionSuccess = true;
    } else {
      opReturnMessage = 'Error in decrypting message!';
    }
  }

  const parsedTx: ParsedChronikTx = {
    incoming,
    xpiAmount: xpiAmountString,
    originatingHash160,
    opReturnMessage,
    isLotusMessage,
    isEncryptedMessage,
    decryptionSuccess,
    replyAddress,
    destinationAddress,
    isBurn,
    burnInfo: isBurn && parseBurnResult,
    xpiBurnAmount: xpiBurnAmountString
  };
  return parsedTx;
};

export const getTxHistoryChronik = async (
  chronik: ChronikClient,
  XPI: BCHJS,
  wallet: WalletState
): Promise<{ chronikTxHistory: Array<Tx & { parsed: ParsedChronikTx }> }> => {
  // Create array txHistory with selectedPath
  const walletPathSelected = getSelectedWalletPathFromWalletState(wallet);

  const hash160AndADresssObj: Hash160AndAddress = {
    address: walletPathSelected.xAddress,
    hash160: walletPathSelected.hash160
  };

  const txHistoryPromise: Promise<TxHistoryPage> = returnGetTxHistoryChronikPromise(chronik, hash160AndADresssObj);
  let txHistoryOfAllAddresses: TxHistoryPage;
  try {
    txHistoryOfAllAddresses = await Promise.resolve(txHistoryPromise);
  } catch (err) {
    console.log(`Error in Promise.all(txHistoryPromises)`, err);
  }
  const sortedTxHistoryArray = sortAndTrimChronikTxHistory(txHistoryOfAllAddresses.txs, currency.txHistoryCount);

  // Parse txs
  const chronikTxHistory: Array<Tx & { parsed: ParsedChronikTx }> = [];
  for (let i = 0; i < sortedTxHistoryArray.length; i += 1) {
    const sortedTx: any = sortedTxHistoryArray[i];
    // Add token genesis info so parsing function can calculate amount by decimals
    sortedTx.parsed = await parseChronikTx(XPI, chronik, sortedTx, wallet);
    chronikTxHistory.push(sortedTx as Tx & { parsed: ParsedChronikTx });
  }

  return {
    chronikTxHistory
  };
};
