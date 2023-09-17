import { put, takeLatest } from 'redux-saga/effects';

import {
  FOLLOW_USER_SAGA,
  GET_FOLLOWERS_SAGA,
  GET_REPOSITORY_SAGA,
  GET_USER_INFO_SAGA,
  UPDATE_USER_SAGA
} from '@/redux/ActionSaga/UserActionSaga';
import { setRepos, setUser } from '@/redux/Slice/UserSlice';
import { setFollowers } from '@/redux/Slice/ActiveListSlice';
import { setOwnerInfo } from '@/redux/Slice/PostSlice';
import { closeDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';

import { userService } from '@/services/UserService';
import { STATUS_CODE } from '@/util/constants/SettingSystem';

// Update User Saga
function* updateUserSaga({ payload }: any) {
  try {
    const { data, status } = yield userService.updateUser(
      payload.userUpdate
    );
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setOwnerInfo(data.content));
      yield put(setUser(data.content));
      yield put(setLoading(false));
      yield put(closeDrawer({}));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiUpdateUserSaga() {
  yield takeLatest(UPDATE_USER_SAGA, updateUserSaga);
}

// Get Followers Saga
function* getFollowersSaga() {
  try {
    const { data, status } = yield userService.getFollowers('');
    if (status === STATUS_CODE.SUCCESS) {
      data.content.followers.forEach((follower: any) => {
        follower.username = follower.lastname + ' ' + follower.firstname;
      });
      yield put(setUser(data.content));
      yield put(setFollowers(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetFollowersSaga() {
  yield takeLatest(GET_FOLLOWERS_SAGA, getFollowersSaga);
}

// Get User Info Saga
function* getUserInfoSaga() {
  try {
    const { data, status } = yield userService.getUserInfo();
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setUser(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetUserInfoSaga() {
  yield takeLatest(GET_USER_INFO_SAGA, getUserInfoSaga);
}

// Follow User Saga
function* followUserSaga({ payload }: any) {
  try {
    const { data, status } = yield userService.followUser(payload);
    if (status === STATUS_CODE.SUCCESS) {
      // Do nothing
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiFollowUserSaga() {
  yield takeLatest(FOLLOW_USER_SAGA, followUserSaga);
}

// get Repository Github Saga
function* getRepositoryGithubSaga() {
  try {
    const { data, status } = yield userService.getRepositoryGithub();
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setRepos(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetRepositoryGithubSaga() {
  yield takeLatest(GET_REPOSITORY_SAGA, getRepositoryGithubSaga);
}
