import { Account } from '@models/lib/account';
import { EntityState, EntityId } from '@reduxjs/toolkit';

export interface AccountsState extends EntityState<Account, any> {
  selectedId: Nullable<number> | undefined;
  lixiIdsById: {
    [key: number]: Array<number>;
  };
  editorCache: Nullable<string> | undefined;
  leaderBoard: Account[];
  transactionReady: boolean;
  graphqlRequestLoading: boolean;
  recentHashtagAtHome: string[];
  recentHashtagAtPages:
    | [
        {
          id: string | null;
          hashtags: string[];
        }
      ]
    | [];
  recentHashtagAtToken:
    | [
        {
          id: string | null;
          hashtags: string[];
        }
      ]
    | [];
  accountInfoTemp: Account;
}
