import { call, put, takeLatest } from 'redux-saga/effects';

import {
  CHOOSE_GET_INTEREST_SAGA,
  CHOOSE_GET_STARTED_SAGA,
  CHOOSE_SHOULD_FRIEND_SAGA,
  GET_SHOULD_FRIENDS_SAGA
} from '@/redux/ActionSaga/GetStartedActionSaga';
import { setShouldFriends } from '@/redux/Slice/GetStartedSlice';

import { getStartedService } from '@/services/GetStartedService';
import { STATUS_CODE } from '@/util/constants/SettingSystem';

// Choose Get Started Saga
export function* chooseGetStartedSaga({ payload }: any) {
  try {
    yield call(getStartedService.chooseGetStarted, payload);
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiChooseGetStartedSaga() {
  yield takeLatest(CHOOSE_GET_STARTED_SAGA, chooseGetStartedSaga);
}

// Choose Get Interest Saga
export function* chooseGetInterestSaga({ payload }: any) {
  try {
    yield call(getStartedService.chooseInterest, payload);
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiChooseGetInterestSaga() {
  yield takeLatest(CHOOSE_GET_INTEREST_SAGA, chooseGetInterestSaga);
}

// Choose Should Friends Saga
function* chooseShouldFriendSaga({ payload }: any) {
  try {
    yield getStartedService.chooseShouldFriendPeople(payload);
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoichooseShouldFriendSaga() {
  yield takeLatest(CHOOSE_SHOULD_FRIEND_SAGA, chooseShouldFriendSaga);
}

// Get Should Add Friend Saga
function* getShouldAddFriendSaga() {
  try {
    const { data, status } = yield getStartedService.getShouldAddFriend();
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setShouldFriends(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoigetShouldAddFriendSaga() {
  yield takeLatest(GET_SHOULD_FRIENDS_SAGA, getShouldAddFriendSaga);
}
