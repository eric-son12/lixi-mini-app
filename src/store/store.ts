// import useXPI from '@hooks/useXPI';
import createSagaMiddleware, { Task } from '@redux-saga/core';
import { Action, Store, configureStore } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createRouterMiddleware, initialRouterState } from 'connected-next-router';
import { Context, createWrapper } from 'next-redux-wrapper';
import { Router } from 'next/router';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from 'redux-persist';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

// import { api as pagesApi } from './page/pages.api';
import rootReducer, { serverReducer } from './rootReducer';
import rootSaga from './rootSaga';

export interface SagaStore extends Store {
  __sagaTask: Task;
}

export const makeStore = (context?: Context) => {
  const isServer = typeof window === 'undefined';

  const sagaMiddleware = createSagaMiddleware({
    onError: (error: Error, { sagaStack: string }) => {
      console.log(error);
    },
   //  context: {
   //    useXPI: useXPI
   //  }
  });

  const routerMiddleware = createRouterMiddleware();
  // const { asPath } = (context as any)?.ctx || (Router as any).router || {};
  // let initialState;
  // if (asPath) {
  //   initialState = {
  //     router: initialRouterState(asPath)
  //   };
  // }

  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return (
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
          }
        })
          // We only need one middleware for rtk query here
          // because all apis are splitted, but actually be enhanced from only 1 baseApi
          // If we concat multiple middleware here, each time there's an internal rtk query action
          // multiple instances of same action will be dispatched, caused onQueryStarted run multiple times.
          // .concat(pagesApi.middleware)
          // .concat(sagaMiddleware, routerMiddleware)
          .concat(sagaMiddleware)
      );
    },
    devTools:
      process.env.NODE_ENV === 'production'
        ? false
        : {
            actionsDenylist: [
              'wallet/writeWalletStatus',
              'posts/setShowCreatePost',
              'analyticEvent/batchEvents',
              'analyticEvent/analyticEvent'
            ]
          },
    // preloadedState: initialState
  });
  setupListeners(store.dispatch);

  (store as SagaStore).__sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const persistor = persistStore(makeStore());

// Define utilities types for redux toolkit
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
export { persistor }