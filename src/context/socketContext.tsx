import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { connectWebSocket } from '@local-store/websocket/websocketUtils'; // Implement this function
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '@local-store/hooks';
import { connectToChannels } from '@local-store/websocket';
import { getSelectedAccount } from '@local-store/account';
// import { userSubcribeToAddressChannel, userSubcribeToMultiPageMessageSession } from '@store/message/actions';
import usePrevious from '@hooks/usePrevious';
import { Account } from '@models/index';

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();
  const selectedAccount = useAppSelector(getSelectedAccount);
  const previousSelectedAccount: Account = usePrevious(selectedAccount);

  useEffect(() => {
    const setupSocket = async () => {
      const newSocket = await connectWebSocket();
      setSocket(newSocket);
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      dispatch(connectToChannels());
    }
  }, [socket]);

  useEffect(() => {
    //if change account, disconnect socket and reconnect
    if (previousSelectedAccount && selectedAccount?.address !== previousSelectedAccount?.address) {
      if (socket) socket.disconnect();

      const setupSocket = async () => {
        const newSocket = await connectWebSocket();
        setSocket(newSocket);
      };

      setupSocket();
    }
  }, [selectedAccount]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
