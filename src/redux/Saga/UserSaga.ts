import { call, put, takeLatest } from 'redux-saga/effects';

import {
  FOLLOW_USER_SAGA,
  GET_FOLLOWERS_SAGA,
  GET_REPOSITORY_SAGA,
  GET_USER_INFO_SAGA,
  UPDATE_USER_SAGA
} from '@/redux/ActionSaga/UserActionSaga';
import { setRepos, setUser } from '@/redux/Slice/UserSlice';
import { setFollowers } from '@/redux/Slice/ActiveListSlice';
import { closeDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';

import { userService } from '@/services/UserService';
import { STATUS_CODE } from '@/util/constants/SettingSystem';

// Update User Saga
function* updateUserSaga({ payload }: any) {
  try {
    const { data, status } = yield call(userService.updateUser, payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setUser(data.metadata));
      yield put(setLoading(false));
      yield put(closeDrawer({}));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiUpdateUserSaga() {
  yield takeLatest(UPDATE_USER_SAGA, updateUserSaga);
}

// Get Followers Saga
function* getFollowersSaga() {
  try {
    const { data, status } = yield call(userService.getFollowers, '');
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setFollowers(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetFollowersSaga() {
  yield takeLatest(GET_FOLLOWERS_SAGA, getFollowersSaga);
}

// Get User Info Saga
function* getUserInfoSaga() {
  try {
    const { data, status } = yield call(userService.getUserInfo);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setUser(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetUserInfoSaga() {
  yield takeLatest(GET_USER_INFO_SAGA, getUserInfoSaga);
}

// Follow User Saga
function* followUserSaga({ payload }: any) {
  try {
    const { status } = yield call(userService.followUser, payload);
    if (status === STATUS_CODE.SUCCESS) {
      // Do nothing
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiFollowUserSaga() {
  yield takeLatest(FOLLOW_USER_SAGA, followUserSaga);
}

// get Repository Github Saga
function* getRepositoryGithubSaga() {
  try {
    const { data, status } = yield call(userService.getRepositoryGithub);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setRepos(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetRepositoryGithubSaga() {
  yield takeLatest(GET_REPOSITORY_SAGA, getRepositoryGithubSaga);
}
