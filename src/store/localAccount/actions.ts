import { LocalUserAccount } from '@models/index';
import { createAction } from '@reduxjs/toolkit';
import { COIN } from '@models/constants';
import { LocalUser } from './localUser';

export const setLocalUserAccount = createAction<LocalUserAccount>('localUserAccount/setLocalUserAccount');
export const silentLocalLogin = createAction<LocalUser>('localUserAccount/silentLocalLogin');
export const silentLocalLoginSuccess = createAction<LocalUser>('localUserAccount/silentLocalLoginSuccess');
export const silentLocalLoginFailure = createAction<string>('localUserAccount/silentLocalLoginFailure');
