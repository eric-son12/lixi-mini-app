import { useContext } from 'react';
import { createCaller } from 'react-outside-call';

import { AuthorizationContext } from './authorizationProvider';
import { WalletContext } from './walletProvider';
import { SocketContext } from './socketContext';
import { FeatureToggleContext } from './featureToggleContext';

export const callConfig = createCaller({
  authorizationContext: () => useContext(AuthorizationContext),
  walletContext: () => useContext(WalletContext),
  socketContext: () => useContext(SocketContext),
  featureContext: () => useContext(FeatureToggleContext)
});
