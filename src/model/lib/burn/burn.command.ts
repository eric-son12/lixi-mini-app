import { BurnForType, BurnType } from './burn.model';

export class BurnCommand {
  txHex: string;

  burnType: BurnType;

  burnForType: BurnForType;

  burnedBy: string;

  burnForId: string;

  burnValue: string;

  postQueryTags?: string;

  pageId?: string;

  tokenId?: string;

  tipToAddresses?: { address: string; amount: string }[];

  // Params to patch rtk query data
  queryParams?: any;
}

export class BurnQueueCommand {
  txHex?: string;

  burnType: BurnType;

  burnForType: BurnForType;

  burnedBy: string;

  burnForId: string;

  burnValue: string;

  defaultFee: number;

  tipToAddresses?: { address: string; amount: string }[];

  extraArguments?: BurnExtraArguments;
}

export class BurnExtraArguments {
  query?: string;

  hashtags?: string[];

  postQueryTags?: string[];

  minBurnFilter?: number;

  level?: number;

  pageId?: string;

  tokenId?: string;

  postId?: string;

  userId?: number;

  hashtagId?: string;

  orderBy?: any;
}
