import {
  Account,
  AccountDto,
  CreateAccountCommand,
  DeleteAccountCommand,
  ImportAccountCommand,
  Lixi,
  LocalUserAccount,
  LoginViaEmailCommand,
  RegisterViaEmailNoVerifiedCommand,
  RenameAccountCommand,
  SecondaryLanguageAccountCommand
} from '@models/index';
import { COIN } from '@models/constants';
import { callConfig } from '@context/index';
import { PayloadAction } from '@reduxjs/toolkit';
import { setLocalUserAccount, silentLocalLogin } from '@local-store/localAccount';
// import { fetchNotifications, removeAllNotifications } from '@store/notification/actions';
// // import { getCurrentLocale } from '@store/settings/selectors';
// import { removeAllWallets, removeWalletPaths } from '@local-store/wallet';
import { aesGcmDecrypt, aesGcmEncrypt, numberToBase58 } from '@utils/encryptionMethods';
// import { push } from 'connected-next-router';
// // import intl from 'react-intl-universal';
import { all, call, fork, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';
// import { LocalUser } from '../../models/localUser';

// import { ChangeAccountLocaleCommand } from '@models/index';
import { PatchAccountCommand } from '@models/index';
import accountApi from '../account/api';
// // import lixiApi from '../lixi/api';
import { hideLoading, showLoading } from '../loading/actions';
// import { showToast } from '../toast/actions';
import {
  changeAccountLocale,
  changeAccountLocaleFailure,
  changeAccountLocaleSuccess,
  deleteAccount,
  deleteAccountFailure,
  deleteAccountSuccess,
  generateAccount,
  getAccount,
  getAccountFailure,
  getAccountSuccess,
  getLeaderboard,
  getLeaderboardFailure,
  getLeaderboardSuccess,
  importAccount,
  importAccountFailure,
  importAccountSuccess,
  loginViaEmail,
  loginViaEmailFailure,
  loginViaEmailSuccess,
  postAccount,
  postAccountFailure,
  postAccountSuccess,
  refreshLixiList,
  refreshLixiListFailure,
  refreshLixiListSilent,
  refreshLixiListSilentSuccess,
  refreshLixiListSuccess,
  registerViaEmailNoVerified,
  registerViaEmailNoVerifiedFailure,
  registerViaEmailNoVerifiedSuccess,
  renameAccount,
  renameAccountFailure,
  renameAccountSuccess,
  selectAccount,
  selectAccountFailure,
  selectAccountSuccess,
  setAccount,
  setAccountInfoTemp,
  setAccountSuccess,
  silentLogin,
  silentLoginFailure,
  silentLoginSuccess,
  verifyEmail,
  verifyEmailFailure,
  verifyEmailSuccess,
  setSecondaryLanguageAccount,
  setSecondaryLanguageAccountSuccess,
  setSecondaryLanguageAccountFailure,
  removeUpload
} from './actions';
import { getAccountById, getAllAccountsIds, getSelectedAccount, getSelectedAccountId } from './selectors';
import { saveClaimAddress } from '@local-store/claim';
import { LocalUser } from '../localAccount/localUser';
// import { changeCurrentLocale, setInitIntlStatus } from '@store/settings/actions';
// import { removeAllPageMessageSession } from '@store/message';

const nameConfigGenerator: Config = {
  dictionaries: [names, names],
  separator: ' '
};

/**
 * Generate a account with random encryption password
 * @param action The data to needed generate a account
 */
function* generateAccountSaga(action: PayloadAction<{ coin: COIN }>) {
  const { coin } = action.payload;
  const { XPI } = callConfig.call.walletContext;
  const lang = 'english';
  const Bip39128BitMnemonic = XPI.Mnemonic.generate(128, XPI.Mnemonic.wordLists()[lang]);

  // Encrypted mnemonic is encrypted by itself
  const encryptedMnemonic: string = yield call(aesGcmEncrypt, Bip39128BitMnemonic, Bip39128BitMnemonic);

  // Hash mnemonic and use it as an id in the database
  const mnemonicUtf8 = new TextEncoder().encode(Bip39128BitMnemonic); // encode mnemonic as UTF-8
  const mnemonicHashBuffer = yield call([crypto.subtle, crypto.subtle.digest], 'SHA-256', mnemonicUtf8); // hash the mnemonic
  const mnemonicHash = Buffer.from(new Uint8Array(mnemonicHashBuffer)).toString('hex');
  // const locale: string | undefined = yield select(getCurrentLocale);

  const account: CreateAccountCommand = {
    mnemonic: Bip39128BitMnemonic,
    encryptedMnemonic,
    mnemonicHash,
    // language: locale,
    coin: coin ? coin : COIN.XPI
  };

  yield put(postAccount(account));
}

// function* getLeaderboardSaga(action: PayloadAction<number>) {
//   try {
//     yield put(showLoading(getLeaderboard.type));
//     const data = yield call(accountApi.getLeaderboard);
//     yield put(getLeaderboardSuccess(data));
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.couldNotFetchAccount');
//     yield put(getLeaderboardFailure(message));
//   }
// }

// function* getLeaderboardSuccessSaga(action: any) {
//   yield put(hideLoading(getLeaderboard.type));
// }

// function* getLeaderboardFailureSaga(action: PayloadAction<string>) {
//   const message = action.payload ?? intl.get('account.unableGetAccountFromServer');
//   yield put(
//     showToast('error', {
//       message: 'Error',
//       description: message,
//       duration: 5
//     })
//   );
//   yield put(hideLoading(getLeaderboard.type));
// }

// function* getAccountSaga(action: PayloadAction<number>) {
//   try {
//     yield put(showLoading(getAccount.type));
//     const id = action.payload;
//     const data = yield call(accountApi.getById, id);
//     yield put(getAccountSuccess(data));
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.couldNotFetchAccount');
//     yield put(getAccountFailure(message));
//   }
// }

// function* getAccountSuccessSaga(action: PayloadAction<Account>) {
//   // Hide the loading
//   yield put(setAccount(action.payload));
//   yield put(hideLoading(getAccount.type));
// }

// function* getAccountFailureSaga(action: PayloadAction<string>) {
//   const message = action.payload ?? intl.get('account.unableGetAccountFromServer');
//   yield put(
//     showToast('error', {
//       message: 'Error',
//       description: message,
//       duration: 5
//     })
//   );
//   yield put(hideLoading(getAccount.type));
// }

function* postAccountSaga(action: PayloadAction<CreateAccountCommand>) {
  try {
    const command = action.payload;

    yield put(showLoading(postAccount.type));

    const data: AccountDto = yield call(accountApi.post, command);

    // Merge back to action payload
    const result = {
      ...command,
      ...data,
      coin: command.coin
    } as Account;

    yield put(postAccountSuccess(result));
  } catch (err) {
    const message = (err as Error).message; //?? intl.get('account.couldNotPostAccount');
    yield put(postAccountFailure(message));
  }
}

function* postAccountSuccessSaga(action: PayloadAction<Account>) {
  const account = action.payload;
  if (account && account.address.includes(account.name)) {
    const newNameGenerator = uniqueNamesGenerator(nameConfigGenerator);
    const command: RenameAccountCommand = {
      id: account.id,
      mnemonic: account.mnemonic,
      name: newNameGenerator
    };
    yield put(renameAccount(command));
    yield put(saveClaimAddress(account.address));
  }
  // yield put(
  //   showToast('success', {
  //     message: 'Success',
  //     description: intl.get('account.createAccountSuccessful'),
  //     duration: 5
  //   })
  // );
  yield put(setAccount(account));
  yield put(hideLoading(postAccount.type));
}

function* postAccountFailureSaga(action: PayloadAction<string>) {
  const message = action.payload; //?? intl.get('account.unableToCreateServer');
  // yield put(
  //   showToast('error', {
  //     message: 'Error',
  //     description: message,
  //     duration: 5
  //   })
  // );
  yield put(hideLoading(postAccount.type));
}

function* importAccountSaga(action: PayloadAction<string>) {
  try {
    const mnemonic: string = action.payload;

    // Hash mnemonic and use it as an id in the database
    const mnemonicUtf8 = new TextEncoder().encode(mnemonic); // encode mnemonic as UTF-8
    const mnemonicHashBuffer = yield call([crypto.subtle, crypto.subtle.digest], 'SHA-256', mnemonicUtf8); // hash the mnemonic
    const mnemonicHash = Buffer.from(new Uint8Array(mnemonicHashBuffer)).toString('hex');

    // const locale = yield select(getCurrentLocale);

    const command: ImportAccountCommand = {
      mnemonic,
      mnemonicHash
      // language: locale
    };

    const data: AccountDto = yield call(accountApi.import, command);

    // Merge back to action payload
    const account = { ...data } as Account;

    const lixies: Lixi[] = [];

    try {
      // const lixiesData = (yield call(lixiApi.getByAccountId, account.id)) as Lixi[];
      // if (lixiesData && lixiesData.length > 0) {
      //   for (const item of lixiesData) {
      //     // Calculate the claim code
      //     const encodedId = numberToBase58(item.id);
      //     const claimPart = yield call(aesGcmDecrypt, item.encryptedClaimCode, command.mnemonic);
      //     const lixi: Lixi = {
      //       ...item,
      //       claimCode: claimPart + encodedId
      //     };
      //     lixies.push(lixi);
      //   }
      // }
    } catch (err) {
      // The mnemonic is new and currently not existed in the database
    }
    account.mnemonic = mnemonic;
    yield put(importAccountSuccess({ account: account, lixies: lixies }));
  } catch (err) {
    const message = (err as Error).message; //?? intl.get('account.unableToImport');
    yield put(importAccountFailure(message));
  }
}

function* importAccountSuccessSaga(action: PayloadAction<{ account: Account; lixies: Lixi[] }>) {
  // yield put(
  //   showToast('success', {
  //     message: 'Success',
  //     description: intl.get('account.accountImportSuccess'),
  //     duration: 5
  //   })
  // );
  const account = yield select(getAccountById(action.payload.account.id));
  if (account && account.address.includes(account.name)) {
    const newNameGenerator = uniqueNamesGenerator(nameConfigGenerator);
    const command: RenameAccountCommand = {
      id: account.id,
      mnemonic: account.mnemonic,
      name: newNameGenerator
    };
    yield put(renameAccount(command));
  }
  yield put(setAccount(account));
  yield put(hideLoading(importAccount.type));
  yield putResolve(silentLogin(action.payload.account.mnemonic));
}

function* importAccountFailureSaga(action: PayloadAction<string>) {
  const message = action.payload; //?? intl.get('account.unableToImport');
  // yield put(
  //   showToast('error', {
  //     message: 'Error',
  //     description: message,
  //     duration: 5
  //   })
  // );
  yield put(hideLoading(importAccount.type));
}

function* selectAccountSaga(action: PayloadAction<number>) {
  try {
    yield put(showLoading(selectAccount.type));
    const previousAccountId = yield select(getSelectedAccountId);
    const previousAccountData = yield call(accountApi.getById, previousAccountId);
    const previousAccount = previousAccountData as Account;
    const accountId = action.payload;
    const data = yield call(accountApi.getById, accountId);
    const account = data as Account;
    // const lixiesData = yield call(lixiApi.getByAccountId, accountId);
    // const lixies = (lixiesData ?? []) as Lixi[];

    yield put(
      selectAccountSuccess({
        account: account,
        // lixies: lixies,
        previousAccount
      })
    );
  } catch (err) {
    const message = (err as Error).message; //?? intl.get('account.unableToSelect');
    yield put(selectAccountFailure(message));
  }
}

function* selectAccountSuccessSaga(
  action: PayloadAction<{
    account: Account;
    lixies?: Lixi[];
    previousAccount: Account;
  }>
) {
  const { account: currentAccount, previousAccount } = action.payload;
  const account = yield select(getAccountById(action.payload.account.id));

  // if (previousAccount?.language != currentAccount?.language) {
  //   yield put(setInitIntlStatus(false));
  //   yield put(changeCurrentLocale(currentAccount.language));
  // }

  const localAccount: LocalUserAccount = {
    mnemonic: account.mnemonic,
    language: account.language,
    address: account.address,
    balance: account.balance,
    name: account.name,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    coin: account.coin ? account.coin : COIN.XPI
  };
  yield put(setLocalUserAccount(localAccount));
  yield putResolve(silentLogin(account.mnemonic));
  // yield put(removeAllPageMessageSession());
  yield put(hideLoading(selectAccount.type));
}

function* selectAccountFailureSaga(action: PayloadAction<string>) {
  const message = action.payload; //?? intl.get('account.unableToSelect');
  // yield put(
  //   showToast('error', {
  //     message: 'Error',
  //     description: message,
  //     duration: 5
  //   })
  // );
  yield put(hideLoading(selectAccount.type));
}

function* setAccountSaga(action: PayloadAction<Account>) {
  yield put(setAccountSuccess({ ...action.payload }));
}

function* setAccountSuccessSaga(action: PayloadAction<Account>) {
  const account = yield select(getAccountById(action.payload.id));
  const localAccount: LocalUserAccount = {
    mnemonic: account.mnemonic,
    language: account.language,
    address: account.address,
    balance: account.balance,
    name: account.name,
    coin: account.coin ? account.coin : COIN.XPI,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt
  };
  yield put(setLocalUserAccount(localAccount));
  yield putResolve(silentLogin(account.mnemonic));
}

function* renameAccountSaga(action: PayloadAction<RenameAccountCommand>) {
  try {
    yield put(showLoading(renameAccount.type));
    const { id } = action.payload;

    const patchAccountCommand: PatchAccountCommand = {
      id: action.payload.id,
      mnemonic: action.payload.mnemonic,
      name: action.payload.name
    };

    const data = yield call(accountApi.patch, id, patchAccountCommand);
    const account = data as Account;
    yield put(renameAccountSuccess(account));
  } catch (err) {
    // const message = (err as Error).message ?? intl.get('account.unableToSelect');
    // yield put(renameAccountFailure(message));
  }
}

function* renameAccountSuccessSaga(action: PayloadAction<Account>) {
  const account = action.payload;
  // Handle not show modal when change name auto generator
  yield put(hideLoading(renameAccount.type));
  if (account.address.includes(account.name)) {
    // yield put(
    //   showToast('success', {
    //     message: intl.get('toast.success'),
    //     description: intl.get('account.accountRenamedSuccess')
    //   })
    // );
  }
}

function* renameAccountFailureSaga(action: PayloadAction<string>) {
  // yield put(
  //   showToast('error', {
  //     message: intl.get('toast.error'),
  //     description: intl.get('account.renameFailed')
  //   })
  // );
  yield put(hideLoading(renameAccount.type));
}

// function* changeAccountLocaleSaga(action: PayloadAction<ChangeAccountLocaleCommand>) {
//   try {
//     yield put(showLoading(changeAccountLocale.type));
//     const { id } = action.payload;
//     const patchAccountCommand: PatchAccountCommand = {
//       id: action.payload.id,
//       mnemonic: action.payload.mnemonic,
//       language: action.payload.language
//     };

//     const data = yield call(accountApi.patch, id, patchAccountCommand);
//     const account = data as Account;
//     yield put(changeAccountLocaleSuccess(account));
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.unableToChangeLocaleAccount');
//     yield put(changeAccountLocaleFailure(message));
//   }
// }

// function* changeAccountLocaleSuccessSaga(action: PayloadAction<Account>) {
//   const account = action.payload;
//   const paramFetchNotification = {
//     accountId: account.id,
//     mnemonichHash: account.mnemonicHash
//   };
//   yield put(fetchNotifications(paramFetchNotification));
//   yield put(hideLoading(changeAccountLocale.type));
//   yield put(
//     showToast('success', {
//       message: intl.get('toast.success'),
//       description: intl.get('account.accountChangeLocaleSuccess')
//     })
//   );
// }

// function* changeAccountLocaleFailureSaga(action: PayloadAction<string>) {
//   yield put(
//     showToast('error', {
//       message: intl.get('toast.error'),
//       description: intl.get('account.unableToChangeLocaleAccount')
//     })
//   );
//   yield put(hideLoading(changeAccountLocale.type));
// }

// function* deleteAccountSaga(action: PayloadAction<DeleteAccountCommand>) {
//   try {
//     yield put(showLoading(deleteAccount.type));
//     const { id } = action.payload;
//     const account: Account = yield select(getAccountById(id));
//     const ids = yield select(getAllAccountsIds);
//     yield put(removeWalletPaths(account.address));

//     //current has 1 account then remove all wallet
//     if (ids.length === 1) {
//       yield put(removeAllWallets());
//       yield put(removeAllNotifications());
//     }
//     yield put(deleteAccountSuccess(id));
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.deleteFailed');
//     yield put(deleteAccountFailure(message));
//   }
// }

// function* deleteAccountSuccessSaga(action: PayloadAction<number>) {
//   yield put(hideLoading(deleteAccount.type));

//   // unsubscribe webpush subscription

//   yield put(
//     showToast('success', {
//       message: intl.get('toast.success'),
//       description: intl.get('account.accountDeleteSuccess')
//     })
//   );
// }

// function* deleteAccountFailureSaga(action: PayloadAction<string>) {
//   yield put(
//     showToast('error', {
//       message: intl.get('toast.error'),
//       description: intl.get('account.deleteFailed')
//     })
//   );
//   yield put(hideLoading(deleteAccount.type));
// }

// function* refreshLixiListSaga(action: PayloadAction<number>) {
//   try {
//     yield put(showLoading(refreshLixiList.type));
//     const accountId = action.payload;
//     const data = yield call(accountApi.getById, accountId);
//     const account = data as Account;
//     const lixiesData = yield call(lixiApi.getByAccountId, accountId);
//     const lixies = (lixiesData ?? []) as Lixi[];
//     yield put(refreshLixiListSuccess({ account: account, lixies: lixies }));
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.unableToRefresh');
//     yield put(refreshLixiListFailure(message));
//   }
// }
// function* refreshLixiListSuccessSaga(action: PayloadAction<{ account: Account; lixies: Lixi[] }>) {
//   yield put(
//     showToast('success', {
//       message: 'Success',
//       description: intl.get('claim.refreshSuccess'),
//       duration: 5
//     })
//   );
//   yield put(hideLoading(refreshLixiList.type));
// }
// function* refreshLixiListFailureSaga(action: PayloadAction<number>) {
//   const message = action.payload ?? intl.get('account.unableToRefresh');
//   yield put(
//     showToast('error', {
//       message: 'Error',
//       description: message,
//       duration: 5
//     })
//   );
//   yield put(hideLoading(refreshLixiList.type));
// }

// function* refreshLixiListSilentSaga(action: PayloadAction<number>) {
//   try {
//     const accountId = action.payload;
//     const data = yield call(accountApi.getById, accountId);
//     const account = data as Account;
//     const lixiesData = yield call(lixiApi.getByAccountId, accountId);
//     const lixies = (lixiesData ?? []) as Lixi[];
//     yield put(refreshLixiListSilentSuccess({ account: account, lixies: lixies }));
//   } catch (err) {}
// }

// function* registerViaEmailNoVerifiedSaga(action: PayloadAction<RegisterViaEmailNoVerifiedCommand>) {
//   yield put(showLoading(registerViaEmailNoVerified.type));
//   try {
//     const data = yield call(accountApi.registerViaEmailNoVerified, action.payload);
//     yield put(registerViaEmailNoVerifiedSuccess(data));
//   } catch (err) {
//     yield put(registerViaEmailNoVerifiedFailure(err));
//   }
// }

// function* registerViaEmailSuccessNoVerifiedSaga(action: PayloadAction<any>) {
//   yield put(hideLoading(registerViaEmailNoVerified.type));
//   yield put(
//     showToast('success', {
//       message: 'Success',
//       description: intl.get('account.registerEmailSuccess'),
//       duration: 5
//     })
//   );
// }

// function* registerViaEmailFailureNoVerifiedSaga(action: PayloadAction<any>) {
//   const message = action.payload.message ?? intl.get('account.registerEmailFailed');
//   yield put(
//     showToast('error', {
//       message: 'Error',
//       description: message,
//       duration: 5
//     })
//   );
//   yield put(hideLoading(registerViaEmailNoVerified.type));
// }

// function* loginViaEmailSaga(action: PayloadAction<LoginViaEmailCommand>) {
//   yield put(showLoading(loginViaEmail.type));
//   try {
//     const data = yield call(accountApi.loginViaEmail, action.payload);
//     yield put(loginViaEmailSuccess(data));
//   } catch (err) {
//     yield put(loginViaEmailFailure(err));
//   }
// }

// function* loginViaEmailSuccessSaga(action: PayloadAction<any>) {
//   yield put(hideLoading(loginViaEmail.type));
//   yield put(push(`${action.payload.path}`));
// }

// function* loginViaEmailFailureSaga(action: PayloadAction<any>) {
//   const message = action.payload.message ?? intl.get('account.loginFailed');
//   yield put(
//     showToast('error', {
//       message: 'Error',
//       description: message,
//       duration: 5
//     })
//   );
//   yield put(hideLoading(loginViaEmail.type));
// }

// function* verifyEmailSaga(action: PayloadAction<LoginViaEmailCommand>) {
//   yield put(showLoading(verifyEmail.type));
//   try {
//     yield call(accountApi.verifyEmail, action.payload.username);
//     yield put(verifyEmailSuccess(action.payload));
//   } catch (err) {
//     yield put(verifyEmailFailure(err));
//   }
// }

// function* verifyEmailSuccessSaga(action: PayloadAction<any>) {
//   yield put(hideLoading(verifyEmail.type));
//   yield put(loginViaEmail(action.payload));
// }

// function* verifyEmailFailureSaga(action: PayloadAction<any>) {
//   const message = action.payload.message ?? intl.get('account.verifiedEmailFailed');
//   yield put(
//     showToast('error', {
//       message: 'Error',
//       description: message,
//       duration: 5
//     })
//   );
//   yield put(hideLoading(loginViaEmail.type));
// }

// function* removeUploadSaga(action) {
//   const { id } = action.payload;
//   try {
//     if (id) {
//       yield call(accountApi.removeUpload, id);
//     }
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.unableRemoveUpload');
//     yield put(
//       showToast('error', {
//         message: 'Error',
//         description: message,
//         duration: 5
//       })
//     );
//   }
// }

// function* setSecondaryLanguageAccountSaga(action: PayloadAction<SecondaryLanguageAccountCommand>) {
//   try {
//     yield put(showLoading(setSecondaryLanguageAccount.type));
//     const { id, mnemonic, secondaryLanguage } = action.payload;
//     const patchAccountCommand: PatchAccountCommand = {
//       id,
//       mnemonic,
//       secondaryLanguage
//     };

//     const data = yield call(accountApi.patch, id, patchAccountCommand);
//     const account = data as Account;
//     yield put(setSecondaryLanguageAccountSuccess(account));
//   } catch (err) {
//     const message = (err as Error).message ?? intl.get('account.unableSetSecondLanguage');
//     yield put(setSecondaryLanguageAccountFailure(message));
//   }
// }

// function* setSecondaryLanguageAccountSuccessSaga(action: PayloadAction<Account>) {
//   const { secondaryLanguage } = action.payload;
//   yield put(hideLoading(setSecondaryLanguageAccount.type));
//   yield put(
//     secondaryLanguage != null
//       ? showToast('success', {
//           message: intl.get('toast.success'),
//           description: intl.get('settings.selectLanguageNotTransSuccess', {
//             language: intl.get(`code.${secondaryLanguage}`)
//           })
//         })
//       : showToast('success', {
//           message: intl.get('toast.success'),
//           description: intl.get('settings.removeLanguageNotTrans'),
//           duration: 5
//         })
//   );
// }

// function* setSecondaryLanguageAccountFailureSaga(action: PayloadAction<string>) {
//   yield put(
//     showToast('error', {
//       message: intl.get('toast.error'),
//       description: intl.get('account.unableSetSecondLanguage')
//     })
//   );
//   yield put(hideLoading(setSecondaryLanguageAccount.type));
// }

function* watchGenerateAccount() {
  yield takeLatest(generateAccount.type, generateAccountSaga);
}

// function* watchGetAccount() {
//   yield takeLatest(getAccount.type, getAccountSaga);
// }

// function* watchGetAccountSuccess() {
//   yield takeLatest(getAccountSuccess.type, getAccountSuccessSaga);
// }

// function* watchGetAccountFailure() {
//   yield takeLatest(getAccountFailure.type, getAccountFailureSaga);
// }

function* watchPostAccount() {
  yield takeLatest(postAccount.type, postAccountSaga);
}

function* watchPostAccountSuccess() {
  yield takeLatest(postAccountSuccess.type, postAccountSuccessSaga);
}

function* watchPostAccountFailure() {
  yield takeLatest(postAccountFailure.type, postAccountFailureSaga);
}

function* watchImportAccount() {
  yield takeLatest(importAccount.type, importAccountSaga);
}

function* watchImportAccountSuccess() {
  yield takeLatest(importAccountSuccess.type, importAccountSuccessSaga);
}

function* watchImportAccountFailure() {
  yield takeLatest(importAccountFailure.type, importAccountFailureSaga);
}

function* watchSelectAccount() {
  yield takeLatest(selectAccount.type, selectAccountSaga);
}

function* watchSelectAccountSuccess() {
  yield takeLatest(selectAccountSuccess.type, selectAccountSuccessSaga);
}

function* watchSelectAccountFailure() {
  yield takeLatest(selectAccountFailure.type, selectAccountFailureSaga);
}

function* watchSetAccount() {
  yield takeLatest(setAccount.type, setAccountSaga);
}

function* watchSetAccountSuccess() {
  yield takeLatest(setAccountSuccess.type, setAccountSuccessSaga);
}

function* watchRenameAccount() {
  yield takeLatest(renameAccount.type, renameAccountSaga);
}

function* watchRenameAccountSuccess() {
  yield takeLatest(renameAccountSuccess.type, renameAccountSuccessSaga);
}

function* watchRenameAccountFailure() {
  yield takeLatest(renameAccountFailure.type, renameAccountFailureSaga);
}

// function* watchChangeAccountLocale() {
//   yield takeLatest(changeAccountLocale.type, changeAccountLocaleSaga);
// }

// function* watchChangeAccountLocaleSuccessSaga() {
//   yield takeLatest(changeAccountLocaleSuccess.type, changeAccountLocaleSuccessSaga);
// }

// function* watchChangeAccountLocaleFailureSaga() {
//   yield takeLatest(changeAccountLocaleFailure.type, changeAccountLocaleFailureSaga);
// }

// function* watchDeleteAccount() {
//   yield takeLatest(deleteAccount.type, deleteAccountSaga);
// }

// function* watchDeleteAccountSuccess() {
//   yield takeLatest(deleteAccountSuccess.type, deleteAccountSuccessSaga);
// }

// function* watchDeleteAccountFailure() {
//   yield takeLatest(deleteAccountFailure.type, deleteAccountFailureSaga);
// }

// function* watchRefreshLixiList() {
//   yield takeLatest(refreshLixiList.type, refreshLixiListSaga);
// }
// function* watchRefreshLixiListSuccess() {
//   yield takeLatest(refreshLixiListSuccess.type, refreshLixiListSuccessSaga);
// }
// function* watchRefreshLixiListFailure() {
//   yield takeLatest(refreshLixiListFailure.type, refreshLixiListFailureSaga);
// }

// function* watchRefreshLixiListSilent() {
//   yield takeLatest(refreshLixiListSilent.type, refreshLixiListSilentSaga);
// }

// function* watchRegisterViaEmailNoVerified() {
//   yield takeLatest(registerViaEmailNoVerified.type, registerViaEmailNoVerifiedSaga);
// }
// function* watchRegisterViaEmailNoVerifiedSuccess() {
//   yield takeLatest(registerViaEmailNoVerifiedSuccess.type, registerViaEmailSuccessNoVerifiedSaga);
// }
// function* watchRegisterViaEmailNoVerifiedFailure() {
//   yield takeLatest(registerViaEmailNoVerifiedFailure.type, registerViaEmailFailureNoVerifiedSaga);
// }

// function* watchloginViaEmail() {
//   yield takeLatest(loginViaEmail.type, loginViaEmailSaga);
// }
// function* watchloginViaEmailSuccess() {
//   yield takeLatest(loginViaEmailSuccess.type, loginViaEmailSuccessSaga);
// }
// function* watchloginViaEmailFailure() {
//   yield takeLatest(loginViaEmailFailure.type, loginViaEmailFailureSaga);
// }

// function* watchVerifyEmailEmail() {
//   yield takeLatest(verifyEmail.type, verifyEmailSaga);
// }
// function* watchVerifyEmailSuccess() {
//   yield takeLatest(verifyEmailSuccess.type, verifyEmailSuccessSaga);
// }
// function* watchVerifyEmailFailure() {
//   yield takeLatest(verifyEmailFailure.type, verifyEmailFailureSaga);
// }

// function* watchTopFive() {
//   yield takeLatest(getLeaderboard.type, getLeaderboardSaga);
// }

// function* watchTopFiveSuccess() {
//   yield takeLatest(getLeaderboardSuccess.type, getLeaderboardSuccessSaga);
// }

// function* watchTopFiveFailure() {
//   yield takeLatest(getLeaderboardFailure.type, getLeaderboardFailureSaga);
// }

function* silentLoginSaga(action: PayloadAction<string>) {
  const mnemonic = action.payload;
  try {
    const data = yield call(accountApi.login, mnemonic);
    yield put(silentLoginSuccess());
  } catch (err) {
    yield put(silentLoginFailure());
  }
}

function* silentLoginSuccessSaga(action: PayloadAction) {
  const account = yield select(getSelectedAccount);

  // If server login then we also local-login
  const localUser: LocalUser = {
    id: account.address,
    address: account.address,
    name: account.name,
    coin: account.coin ? account.coin : COIN.XPI
  };
  // yield put(activateWallet(account.mnemonic));
  // yield put(silentLocalLogin(localUser));
  // const promise = yield put(
  //   accountGraphApi.endpoints.getAccountByAddress.initiate({
  //     address: account.address
  //   })
  // );
  // yield promise;
  // const data = yield promise.unwrap();
  // yield put(setAccountInfoTemp(data.getAccountByAddress));
  // yield putResolve(
  //   fetchNotifications({
  //     accountId: account.id,
  //     mnemonichHash: account.mnemonicHash
  //   })
  // );
}

function* watchSilentLogin() {
  yield takeLatest(silentLogin.type, silentLoginSaga);
}

// function* watchRemoveUpload() {
//   yield takeLatest(removeUpload.type, removeUploadSaga);
// }

function* watchSilentLoginSuccess() {
  yield takeLatest(silentLoginSuccess.type, silentLoginSuccessSaga);
}

// function* watchSetSecondaryLanguageAccount() {
//   yield takeLatest(setSecondaryLanguageAccount.type, setSecondaryLanguageAccountSaga);
// }

// function* watchSetSecondaryLanguageAccountSagaSuccess() {
//   yield takeLatest(setSecondaryLanguageAccountSuccess.type, setSecondaryLanguageAccountSuccessSaga);
// }

// function* watchSetSecondaryLanguageAccountSagaFailure() {
//   yield takeLatest(setSecondaryLanguageAccountFailure.type, setSecondaryLanguageAccountFailureSaga);
// }

export default function* accountSaga() {
  yield all([
    fork(watchGenerateAccount),
    // fork(watchRemoveUpload),
    // fork(watchGetAccount),
    // fork(watchGetAccountSuccess),
    // fork(watchGetAccountFailure),
    fork(watchPostAccount),
    fork(watchPostAccountSuccess),
    fork(watchPostAccountFailure),
    fork(watchImportAccount),
    fork(watchImportAccountSuccess),
    fork(watchImportAccountFailure),
    fork(watchSelectAccount),
    fork(watchSelectAccountSuccess),
    fork(watchSelectAccountFailure),
    fork(watchSetAccount),
    fork(watchSetAccountSuccess),
    // fork(watchRefreshLixiList),
    // fork(watchRefreshLixiListSuccess),
    // fork(watchRefreshLixiListFailure),
    // fork(watchRefreshLixiListSilent),
    fork(watchRenameAccount),
    fork(watchRenameAccountSuccess),
    fork(watchRenameAccountFailure),
    // fork(watchChangeAccountLocale),
    // fork(watchChangeAccountLocaleSuccessSaga),
    // fork(watchChangeAccountLocaleFailureSaga),
    // fork(watchDeleteAccount),
    // fork(watchDeleteAccountSuccess),
    // fork(watchDeleteAccountFailure),
    fork(watchSilentLogin),
    fork(watchSilentLoginSuccess)
    // fork(watchRegisterViaEmailNoVerified),
    // fork(watchRegisterViaEmailNoVerifiedSuccess),
    // fork(watchRegisterViaEmailNoVerifiedFailure),
    // fork(watchloginViaEmail),
    // fork(watchloginViaEmailSuccess),
    // fork(watchloginViaEmailFailure),
    // fork(watchVerifyEmailEmail),
    // fork(watchVerifyEmailSuccess),
    // fork(watchVerifyEmailFailure),
    // fork(watchTopFive),
    // fork(watchTopFiveSuccess),
    // fork(watchTopFiveFailure),
    // fork(watchSetSecondaryLanguageAccount),
    // fork(watchSetSecondaryLanguageAccountSagaSuccess),
    // fork(watchSetSecondaryLanguageAccountSagaFailure)
  ]);
}
