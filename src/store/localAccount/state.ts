import { LocalUserAccount } from '@models/lib/account';
import { EntityState } from '@reduxjs/toolkit';

export interface LocalUserAccountsState extends EntityState<LocalUserAccount, any> {
  selectedId: Nullable<string> | undefined;
}
