import { put, select, takeLatest } from 'redux-saga/effects';
import { userService } from '../../services/UserService';
import STATUS_CODE from '@/utils/constants/statusCodes';
import {
  FOLLOW_USER_SAGA,
  GET_FOLLOWERS_SAGA,
  GET_REPOSITORY_SAGA,
  GET_USER_INFO_SAGA,
  REGIS_USER_SAGA,
  UPDATE_USER_SAGA,
} from '../actionSaga/UserActionSaga';
import { setRepos, setUser } from '../Slice/UserSlice';
import { setFollowers } from '../Slice/ActiveListSlice';
import { setOwnerInfo } from '../Slice/PostSlice';
import { closeDrawer, setLoading } from '../Slice/DrawerHOCSlice';
import { setLogin } from '../Slice/AuthSlice';

// registerUser Saga
function* registerUserSaga({ payload }: any) {
  try {
    const { data, status } = yield userService.registerUser(
      payload.userRegister
    );
    if (status === STATUS_CODE.CREATED) {
      // localStorage.setItem(TOKEN, JSON.stringify(data.content?.accessToken));

      // Lưu theme vào localStorage
      // yield put(setTheme({ theme: DARK_THEME }));

      window.location.replace("/");
    }
  } catch (err: any) {
    localStorage.removeItem(TOKEN);
    console.log(err.response.data);
  }
}

export function* theoDoiRegisterUserSaga() {
  yield takeLatest(REGIS_USER_SAGA, registerUserSaga);
}

// Update User Saga
function* updateUserSaga({ payload }: any) {
  try {
    const { data, status } = yield userService.updateUser(
      payload.id,
      payload.userUpdate
    );
    if (status === STATUS_CODE.OK) {
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
    const { data, status } = yield userService.getFollowers();
    if (status === STATUS_CODE.OK) {
      data.content.followers.forEach((follower: any) => {
        follower.username = follower.lastname + " " + follower.firstname;
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
    if (status === STATUS_CODE.OK) {
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
    if (status === STATUS_CODE.OK) {
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
    if (status === STATUS_CODE.OK) {
      yield put(setRepos(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetRepositoryGithubSaga() {
  yield takeLatest(GET_REPOSITORY_SAGA, getRepositoryGithubSaga);
}
