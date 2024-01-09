import { COIN } from '@models/constants';

export type LocalUser = {
  id: string;
  address: string;
  name: string;
  isLocalLoggedIn?: boolean;
  coin: COIN;
};
