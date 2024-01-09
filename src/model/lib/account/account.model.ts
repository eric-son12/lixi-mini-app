import { COIN } from '../../constants';

export class Account {
  id: number;

  name: string;

  balance?: number;

  mnemonic?: string;

  encryptedMnemonic?: string;

  encryptedSecret?: string;

  secret?: string;

  publicKey?: string;

  createdAt?: Date;

  updatedAt?: Date;

  mnemonicHash?: string;

  address: string;

  language?: string;

  secondaryLanguage?: Nullable<string>;

  followersCount?: number;

  followingsCount?: number;

  followingPagesCount?: number;

  avatar?: Nullable<string>;

  cover?: Nullable<string>;

  description?: Nullable<string>;

  website?: Nullable<string>;

  dayOfBirth?: Nullable<number>;

  monthOfBirth?: Nullable<number>;

  yearOfBirth?: Nullable<number>;

  createCommentFee?: Nullable<string>;

  coin?: Nullable<COIN>;

  followScore?: Nullable<number>;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
