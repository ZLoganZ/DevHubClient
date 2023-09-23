import { all } from 'redux-saga/effects';
import * as authSaga from './AuthSaga';
import * as messageSaga from './MessageSaga';
import * as getStartedSaga from './GetStartedSaga';
import * as communitySaga from './CommunitySaga';

export function* rootSaga() {
  yield all([
    // authSaga
    authSaga.theoDoiLoginSaga(),
    authSaga.theoDoiLogoutSaga(),
    authSaga.theoDoiLoginWithGoogleSaga(),
    authSaga.theoDoiForgotPasswordSaga(),
    authSaga.theoDoiVerifyCodeSaga(),
    authSaga.theoDoiResetPasswordSaga(),
    authSaga.theoDoiCheckVerifyCodeSaga(),
    authSaga.theoDoiCheckResetPasswordSaga(),
    authSaga.theoDoiRegisterSaga(),
    authSaga.theoDoiGetUserIDSaga(),

    // // userSaga
    // userSaga.theoDoiUpdateUserSaga(),
    // userSaga.theoDoiGetFollowersSaga(),
    // userSaga.theoDoiGetUserInfoSaga(),
    // userSaga.theoDoiFollowUserSaga(),
    // userSaga.theoDoiGetRepositoryGithubSaga(),

    // // postSaga
    // postSaga.theoDoiCreatePostSaga(),
    // postSaga.theoDoiGetAllPostByUserIDSaga(),
    // postSaga.theoDoiGetAllPostSaga(),
    // postSaga.theoDoiDeletePostSaga(),
    // postSaga.theoDoiLikePostSaga(),
    // postSaga.theoDoiUpdatePostSaga(),
    // postSaga.theoDoiSharePostSaga(),
    // postSaga.theoDoiSavePostSaga(),
    // postSaga.theoDoiSaveCommentSaga(),
    // postSaga.theoDoiGetPostByIdSaga(),
    // postSaga.theoDoiIncreaseViewPostSaga(),
    // postSaga.theoDoiLikeCommentPostSaga(),
    // postSaga.theoDoiDislikeCommentPostSaga(),

    // messageSaga
    messageSaga.theoDoiGetConversationsSaga(),
    messageSaga.theoDoiCreateConversationSaga(),
    messageSaga.theoDoiGetConversationSaga(),
    messageSaga.theoDoiGetMessagesSaga(),
    messageSaga.theoDoiSeenMessageSaga(),
    messageSaga.theoDoiSendMessageSaga(),

    // getStartedSaga
    getStartedSaga.theoDoiChooseGetStartedSaga(),
    getStartedSaga.theoDoiChooseGetInterestSaga(),
    getStartedSaga.theoDoigetShouldFollowSaga(),
    getStartedSaga.theoDoichooseShouldFollowerSaga(),

    // communitySaga
    communitySaga.theoDoiGetCommunityByIDSaga()
  ]);
}
