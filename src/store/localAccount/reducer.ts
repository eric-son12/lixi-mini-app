import { LocalUserAccount } from '@models/index';
import { createEntityAdapter, createReducer } from '@reduxjs/toolkit';

import { setLocalUserAccount } from './actions';
import { LocalUserAccountsState } from './state';

export const localAccountsAdapter = createEntityAdapter<LocalUserAccount, any>({
  selectId: account => account.address,
  sortComparer: (a, b) => {
    if (a === b) return 0;
    else if (a > b) return 1;
    else return -1;
  }
});

const initialState: LocalUserAccountsState = localAccountsAdapter.getInitialState({
  selectedId: null
});

export const localUserAccountReducer = createReducer(initialState, builder => {
  builder.addCase(setLocalUserAccount, (state, action) => {
    const account = action.payload;
    localAccountsAdapter.upsertOne(state, account);
    state.selectedId = account.address ?? null;
  });
});
