'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, persistor } from '@local-store/store';
import { PersistGate } from 'redux-persist/integration/react';
import OutsideCallConsumer from 'react-outside-call';
import { WalletProvider } from '@context/walletProvider';
import { callConfig } from '@context/shareContext';
import { SocketProvider } from '@context/socketContext';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <WalletProvider>
            <OutsideCallConsumer config={callConfig}>{children}</OutsideCallConsumer>
          </WalletProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
}
