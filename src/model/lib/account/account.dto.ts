import { COIN } from '../../constants';

export interface CreateAccountCommand {
  mnemonic: string;
  encryptedMnemonic: string;
  mnemonicHash: string;
  language?: string;
  coin?: COIN;
}

export interface ImportAccountCommand {
  mnemonic: string;
  mnemonicHash?: string;
  language?: string;
}

export interface ChangeAccountLocaleCommand {
  id: number;
  mnemonic: string;
  language: string;
}

export interface RenameAccountCommand {
  id: number;
  mnemonic: string;
  name: string;
  isAutoNameGenerator?: boolean;
}

export interface SecondaryLanguageAccountCommand {
  id: number;
  mnemonic: string;
  secondaryLanguage: string;
}

export interface PatchAccountCommand {
  id: number;
  mnemonic: string;
  language?: string;
  name?: string;
  secondaryLanguage?: string;
}

export interface DeleteAccountCommand {
  id: number;
  mnemonic: string;
}

export interface AccountDto {
  id?: number;
  name: string;
  mnemonic?: string;
  secret?: string;
  encryptedMnemonic?: string;
  mnemonicHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
  address: string;
  balance?: number;
  language?: string;
  secondaryLanguage?: Nullable<string>;
}

export interface RegisterViaEmailNoVerifiedCommand {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface LoginViaEmailCommand {
  username: string;
  password: string;
}
