import { Claim, ViewClaimDto } from '@models/index';
import { EntityState } from '@reduxjs/toolkit';

export interface ClaimsState extends EntityState<Claim, any> {
  currentAddress: string;
  currentClaimCode: string;
  currentLixiClaim?: Nullable<ViewClaimDto>;
}
