import { Account } from '@models/index';
import { UPLOAD_TYPES } from '@models/constants';
import { createEntityAdapter, createReducer, isAnyOf, Update } from '@reduxjs/toolkit';
import _ from 'lodash';

import {
  deleteAccountSuccess,
  deleteEditorTextFromCache,
  getLeaderboardSuccess,
  importAccountSuccess,
  refreshLixiListSilentSuccess,
  refreshLixiListSuccess,
  removeAllUpload,
  removeUpload,
  renameAccountSuccess,
  saveEditorTextToCache,
  selectAccountSuccess,
  setAccount,
  setTransactionNotReady,
  setTransactionReady,
  setGraphqlRequestLoading,
  setGraphqlRequestDone,
  setUpload,
  addRecentHashtagAtHome,
  removeRecentHashtagAtHome,
  clearRecentHashtagAtHome,
  addRecentHashtagAtPages,
  removeRecentHashtagAtPages,
  clearRecentHashtagAtPages,
  addRecentHashtagAtToken,
  removeRecentHashtagAtToken,
  clearRecentHashtagAtToken,
  setAccountInfoTemp,
  removeAllMessageUpload,
  setAccountAvatar,
  setAccountCover,
  setSecondaryLanguageAccountSuccess,
  changeAccountLocale,
  removeUploadFromCache
} from './actions';
import { AccountsState } from './state';

export const accountsAdapter = createEntityAdapter<Account>({});

const initialState: AccountsState = accountsAdapter.getInitialState({
  selectedId: null,
  lixiIdsById: {},
  envelopeUpload: null,
  accountAvatarUpload: null,
  accountCoverUpload: null,
  pageAvatarUpload: null,
  pageCoverUpload: null,
  postCoverUploads: [],
  productImageUploads: [],
  editorCache: null,
  leaderBoard: [],
  transactionReady: true,
  graphqlRequestLoading: false,
  recentVisitedPeople: [],
  recentHashtagAtHome: [],
  recentHashtagAtPages: [],
  recentHashtagAtToken: [],
  accountInfoTemp: null,
  messageUploads: [],
  commentUpload: null
});

const numberOfRecentHashtags = 3;
const numberOfItemsSaved = 10;

export const accountReducer = createReducer(initialState, builder => {
  builder
    .addCase(setAccount, (state, action) => {
      const account = action.payload;
      accountsAdapter.upsertOne(state, account);
      state.selectedId = _.toSafeInteger(account.id) ?? null;
    })
    .addCase(setAccountAvatar, (state, action) => {
      const avatar = action.payload;
      accountsAdapter.updateOne(state, {
        id: state.selectedId,
        changes: {
          avatar: avatar
        }
      });
    })
    .addCase(setAccountCover, (state, action) => {
      const cover = action.payload;
      accountsAdapter.updateOne(state, {
        id: state.selectedId,
        changes: {
          cover: cover
        }
      });
    })
    .addCase(selectAccountSuccess, (state, action) => {
      const { account, lixies } = action.payload;
      const id = _.toSafeInteger(account.id);
      state.selectedId = id;
      const lixiIds = lixies.map(lixi => lixi.id);
      state.lixiIdsById[id] = lixiIds;
      accountsAdapter.upsertOne(state, account);
    })
    .addCase(importAccountSuccess, (state, action) => {
      const { account, lixies } = action.payload;
      const id = _.toSafeInteger(account.id);
      state.selectedId = id;
      const lixiIds = lixies.map(lixi => lixi.id);
      state.lixiIdsById[id] = lixiIds;
      accountsAdapter.upsertOne(state, account);
    })
    .addCase(renameAccountSuccess, (state, action) => {
      const account = action.payload;
      const updateAccount: Update<Account, any> = {
        id: account.id,
        changes: {
          ...account
        }
      };
      accountsAdapter.updateOne(state, updateAccount);
    })
    .addCase(deleteAccountSuccess, (state, action) => {
      accountsAdapter.removeOne(state, action.payload);
    })
    .addCase(setUpload, (state, action) => {
      const { type, upload } = action.payload;

      switch (type) {
        case UPLOAD_TYPES.ENVELOPE:
          state.envelopeUpload = upload;
          break;
        case UPLOAD_TYPES.ACCOUNT_AVATAR:
          state.accountAvatarUpload = upload;
          break;
        case UPLOAD_TYPES.ACCOUNT_COVER:
          state.accountCoverUpload = upload;
          break;
        case UPLOAD_TYPES.PAGE_AVATAR:
          state.pageAvatarUpload = upload;
          break;
        case UPLOAD_TYPES.PAGE_COVER:
          state.pageCoverUpload = upload;
          break;
        case UPLOAD_TYPES.POST:
          state.postCoverUploads.push(upload);
          break;
        case UPLOAD_TYPES.MESSAGE:
          state.messageUploads.push(upload);
          break;
        case UPLOAD_TYPES.COMMENT:
          state.commentUpload = upload;
          break;
      }
    })
    .addCase(removeUpload, (state, action) => {
      const { uploadType, id } = action.payload;

      switch (uploadType) {
        case UPLOAD_TYPES.ENVELOPE:
          state.envelopeUpload = null;
          break;
        case UPLOAD_TYPES.ACCOUNT_AVATAR:
          state.accountAvatarUpload = null;
          break;
        case UPLOAD_TYPES.PAGE_AVATAR:
          state.pageAvatarUpload = null;
          break;
        case UPLOAD_TYPES.PAGE_COVER:
          state.pageCoverUpload = null;
          break;
        case UPLOAD_TYPES.POST:
          state.postCoverUploads = state.postCoverUploads.filter(image => {
            return image.id !== id;
          });
          break;
        case UPLOAD_TYPES.MESSAGE:
          state.messageUploads = state.messageUploads.filter(image => {
            return image.id !== id;
          });
          break;
        case UPLOAD_TYPES.COMMENT:
          state.commentUpload = null;
          break;
      }
    })
    .addCase(removeUploadFromCache, (state, action) => {
      const { uploadType, id } = action.payload;

      switch (uploadType) {
        case UPLOAD_TYPES.ENVELOPE:
          state.envelopeUpload = null;
          break;
        case UPLOAD_TYPES.ACCOUNT_AVATAR:
          state.accountAvatarUpload = null;
          break;
        case UPLOAD_TYPES.PAGE_AVATAR:
          state.pageAvatarUpload = null;
          break;
        case UPLOAD_TYPES.PAGE_COVER:
          state.pageCoverUpload = null;
          break;
        case UPLOAD_TYPES.POST:
          state.postCoverUploads = state.postCoverUploads.filter(image => {
            return image.id !== id;
          });
          break;
        case UPLOAD_TYPES.MESSAGE:
          state.messageUploads = state.messageUploads.filter(image => {
            return image.id !== id;
          });
          break;
        case UPLOAD_TYPES.COMMENT:
          state.commentUpload = null;
          break;
      }
    })
    .addCase(removeAllUpload, (state, action) => {
      state.postCoverUploads.length = 0;
      state.productImageUploads.length = 0;
    })
    .addCase(removeAllMessageUpload, (state, action) => {
      state.messageUploads.length = 0;
    })
    .addCase(saveEditorTextToCache, (state, action) => {
      const tempPost = action.payload;
      state.editorCache = tempPost;
    })
    .addCase(deleteEditorTextFromCache, (state, action) => {
      state.editorCache = '';
    })
    .addCase(getLeaderboardSuccess, (state, action) => {
      state.leaderBoard = action.payload;
    })
    .addCase(setTransactionReady, (state, action) => {
      state.transactionReady = true;
    })
    .addCase(setTransactionNotReady, (state, action) => {
      state.transactionReady = false;
    })
    .addCase(addRecentHashtagAtHome, (state, action) => {
      const hashtag = action.payload;
      const hashtagExistedIndex = state.recentHashtagAtHome.findIndex(h => h.toLowerCase() === hashtag.toLowerCase());
      if (hashtagExistedIndex !== -1) {
        state.recentHashtagAtHome.splice(hashtagExistedIndex, 1);
      } else if (state.recentHashtagAtHome.length === numberOfRecentHashtags) {
        state.recentHashtagAtHome.pop();
      }

      state.recentHashtagAtHome.unshift(hashtag.toUpperCase());
    })
    .addCase(removeRecentHashtagAtHome, (state, action) => {
      const hashtag = action.payload;
      const hashtagExistedIndex = state.recentHashtagAtHome.findIndex(h => h.toLowerCase() === hashtag.toLowerCase());

      if (hashtagExistedIndex !== -1) {
        state.recentHashtagAtHome.splice(hashtagExistedIndex, 1);
      }
    })
    .addCase(clearRecentHashtagAtHome, (state, action) => {
      state.recentHashtagAtHome.length = 0;
    })
    .addCase(addRecentHashtagAtPages, (state, action) => {
      const { id, hashtag } = action.payload;
      const pageExisted = state.recentHashtagAtPages.find((page: any) => page.id === id);

      if (pageExisted) {
        const hashtagExistedIndex = pageExisted.hashtags.findIndex(h => h.toLowerCase() === hashtag.toLowerCase());

        if (hashtagExistedIndex !== -1) {
          pageExisted.hashtags.splice(hashtagExistedIndex, 1);
        } else if (pageExisted.hashtags.length === numberOfRecentHashtags) {
          pageExisted.hashtags.pop();
        }

        pageExisted.hashtags.unshift(hashtag.toUpperCase());
      } else {
        const recent = {
          id: id,
          hashtags: [hashtag.toUpperCase()]
        };
        if (state.recentHashtagAtPages.length >= numberOfItemsSaved) {
          state.recentHashtagAtPages.shift();
        }
        state.recentHashtagAtPages.push(recent as never);
      }
    })
    .addCase(removeRecentHashtagAtPages, (state, action) => {
      const { id, hashtag } = action.payload;
      const pageExisted = state.recentHashtagAtPages.find((page: any) => page.id === id);

      if (pageExisted) {
        const hashtagExistedIndex = pageExisted.hashtags.findIndex(h => h.toLowerCase() === hashtag.toLowerCase());

        if (hashtagExistedIndex !== -1) {
          pageExisted.hashtags.splice(hashtagExistedIndex, 1);
        }
      }
    })
    .addCase(clearRecentHashtagAtPages, (state, action) => {
      const { id } = action.payload;
      const pageExisted = state.recentHashtagAtPages.find((page: any) => page.id === id);

      if (pageExisted) {
        pageExisted.hashtags.length = 0;
      }
    })
    .addCase(addRecentHashtagAtToken, (state, action) => {
      const { id, hashtag } = action.payload;
      const tokenExisted = state.recentHashtagAtToken.find((page: any) => page.id === id);

      if (tokenExisted) {
        const hashtagExistedIndex = tokenExisted.hashtags.findIndex(h => h.toLowerCase() === hashtag.toLowerCase());

        if (hashtagExistedIndex !== -1) {
          tokenExisted.hashtags.splice(hashtagExistedIndex, 1);
        } else if (tokenExisted.hashtags.length === numberOfRecentHashtags) {
          tokenExisted.hashtags.pop();
        }

        tokenExisted.hashtags.unshift(hashtag.toUpperCase());
      } else {
        const recent = {
          id: id,
          hashtags: [hashtag.toUpperCase()]
        };
        if (state.recentHashtagAtToken.length >= numberOfItemsSaved) {
          state.recentHashtagAtToken.shift();
        }
        state.recentHashtagAtToken.push(recent as never);
      }
    })
    .addCase(removeRecentHashtagAtToken, (state, action) => {
      const { id, hashtag } = action.payload;
      const tokenExisted = state.recentHashtagAtToken.find((page: any) => page.id === id);

      if (tokenExisted) {
        const hashtagExistedIndex = tokenExisted.hashtags.findIndex(h => h.toLowerCase() === hashtag.toLowerCase());

        if (hashtagExistedIndex !== -1) {
          tokenExisted.hashtags.splice(hashtagExistedIndex, 1);
        }
      }
    })
    .addCase(clearRecentHashtagAtToken, (state, action) => {
      const { id } = action.payload;
      const tokenExisted = state.recentHashtagAtToken.find((page: any) => page.id === id);

      if (tokenExisted) {
        tokenExisted.hashtags.length = 0;
      }
    })
    .addCase(setGraphqlRequestLoading, (state, action) => {
      state.graphqlRequestLoading = true;
    })
    .addCase(setGraphqlRequestDone, (state, action) => {
      state.graphqlRequestLoading = false;
    })
    .addCase(setAccountInfoTemp, (state, action) => {
      const accountInfo: Account = action.payload;
      if (accountInfo) state.accountInfoTemp = accountInfo;
    })
    .addCase(setSecondaryLanguageAccountSuccess, (state, action) => {
      const account: Account = action.payload;
      state.entities[account.id].secondaryLanguage = account.secondaryLanguage;
    })
    .addCase(changeAccountLocale, (state, action) => {
      const { language, id } = action.payload;
      state.entities[id].language = language;
    })
    .addMatcher(isAnyOf(refreshLixiListSuccess, refreshLixiListSilentSuccess), (state, action) => {
      const { account, lixies } = action.payload;
      const id = account.id;
      state.selectedId = id;
      const lixiIds = lixies.map(lixi => lixi.id);
      state.lixiIdsById[id] = lixiIds;
      accountsAdapter.upsertOne(state, account);
    });
});
