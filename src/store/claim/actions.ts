import { Claim, CreateClaimDto, ViewClaimDto } from '@models/index';
import { createAction } from '@reduxjs/toolkit';

export const postClaimActionType = 'claim/postClaim';
export const postClaim = createAction<CreateClaimDto>('claim/postClaim');
export const postClaimSuccess = createAction<Claim>('claim/postClaimSuccess');
export const postClaimFailure = createAction('claim/postClaimFailure', (message: string) => {
  return {
    payload: message,
    error: true
  };
});
export const saveClaimAddress = createAction<string>('claim/saveClaimAddress');
export const saveClaimCode = createAction<string>('claim/saveClaimCode');

export const viewClaim = createAction<number>('claim/viewClaim');
export const viewClaimSuccess = createAction<ViewClaimDto>('claim/viewClaimSuccess');
export const viewClaimFailure = createAction<string>('claim/viewClaimFailure');

export const checkInformationAndClaim = createAction<CreateClaimDto>('claim/checkInformationAndClaim');
export const checkInformationAndClaimNoAccount = createAction<string>('claim/getInformationAndClaimNoAccount');
