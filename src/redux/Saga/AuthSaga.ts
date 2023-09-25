import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  CHECK_RESET_PASSWORD_SAGA,
  CHECK_VERIFY_CODE_SAGA,
  FORGOT_PASSWORD_SAGA,
  LOGIN_SAGA,
  LOGIN_WITH_GOOGLE_SAGA,
  LOGOUT_SAGA,
  REGISTER_SAGA,
  RESET_PASSWORD_SAGA,
  VERIFY_CODE_SAGA
} from '@/redux/ActionSaga/AuthActionSaga';
import { setUserID } from '@/redux/Slice/AuthSlice';
import { setTheme } from '@/redux/Slice/ThemeSlice';

import { authService } from '@/services/AuthService';
import {
  DARK_THEME,
  STATUS_CODE,
  AUTHORIZATION,
  GITHUB_TOKEN
} from '@/util/constants/SettingSystem';

// LoginSaga
function* LoginSaga({ payload }: any) {
  try {
    const { data, status } = yield call(authService.login, payload);
    if (status === STATUS_CODE.SUCCESS) {
      // Lưu token vào localStorage
      localStorage.setItem(AUTHORIZATION, data.metadata.tokens.accessToken);

      // Lưu theme vào localStorage
      yield put(setTheme({ theme: DARK_THEME }));

      yield put(setUserID(data.metadata.user._id));

      const { location } = yield select((state) => state.functionReducer);

      const state = location.state as { from: Location };
      const from = state?.from?.pathname || '/';

      window.location.replace(from);
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiLoginSaga() {
  yield takeLatest(LOGIN_SAGA, LoginSaga);
}

// register Saga
function* RegisterSaga({ payload }: any) {
  try {
    const { data, status } = yield call(authService.register, payload);
    if (status === STATUS_CODE.CREATED) {
      localStorage.setItem(AUTHORIZATION, data.metadata.tokens.accessToken);
      // Lưu theme vào localStorage
      yield put(setTheme({ theme: DARK_THEME }));

      yield put(setUserID(data.metadata.user._id));

      window.location.replace('/');
    }
  } catch (err: any) {
    localStorage.removeItem(AUTHORIZATION);
    console.log(err);
  }
}

export function* theoDoiRegisterSaga() {
  yield takeLatest(REGISTER_SAGA, RegisterSaga);
}

// Logout
function* LogoutSaga() {
  try {
    const { status } = yield call(authService.logout);
    if (status === STATUS_CODE.SUCCESS) {
      localStorage.removeItem(AUTHORIZATION);
      localStorage.removeItem(GITHUB_TOKEN);

      window.location.replace('/login');
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiLogoutSaga() {
  yield takeLatest(LOGOUT_SAGA, LogoutSaga);
}

// Login with Google
function* LoginWithGoogleSaga({ payload }: any) {
  try {
    const { data, status } = yield call(authService.loginWithGoogle, payload);
    if (status === STATUS_CODE.SUCCESS) {
      // Lưu token vào localStorage
      localStorage.setItem(
        AUTHORIZATION,
        JSON.stringify(data.metadata?.accessToken)
      );

      // Lưu theme vào localStorage
      yield put(setTheme({ theme: DARK_THEME }));

      const { location } = yield select((state) => state.functionReducer);

      const state = location.state as { from: Location };
      const from = state?.from.pathname || '/';

      window.location.replace(from);
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiLoginWithGoogleSaga() {
  yield takeLatest(LOGIN_WITH_GOOGLE_SAGA, LoginWithGoogleSaga);
}

// Forgot Password Saga
function* ForgotPasswordSaga({ payload }: any) {
  try {
    const { status } = yield call(authService.forgotPassword, payload);
    if (status === STATUS_CODE.SUCCESS) {
      const { navigate } = yield select((state) => state.functionReducer);

      navigate({
        pathname: '/verify',
        search: `?email=${payload.email}&code=${Math.floor(
          Math.random() * 1000000
        )}&note=codetrongemailchukhongphaicodenaydaunehihi`
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiForgotPasswordSaga() {
  yield takeLatest(FORGOT_PASSWORD_SAGA, ForgotPasswordSaga);
}

// Verify Code Saga
function* VerifyCodeSaga({ payload }: any) {
  try {
    const { status } = yield call(authService.verifyCode, payload);
    if (status === STATUS_CODE.SUCCESS) {
      const { navigate } = yield select((state) => state.functionReducer);

      navigate({
        pathname: '/reset',
        search: `?email=${payload.email}&code=${Math.floor(
          Math.random() * 1000000
        )}&note=codetrongemailchukhongphaicodenaydaunehihi`
      });
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiVerifyCodeSaga() {
  yield takeLatest(VERIFY_CODE_SAGA, VerifyCodeSaga);
}

// Reset Password Saga
function* ResetPasswordSaga({ payload }: any) {
  try {
    const { status } = yield call(authService.resetPassword, payload);
    if (status === STATUS_CODE.SUCCESS) {
      const { navigate } = yield select((state) => state.functionReducer);

      navigate('/login');
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiResetPasswordSaga() {
  yield takeLatest(RESET_PASSWORD_SAGA, ResetPasswordSaga);
}

// Check Verify Code Saga
function* CheckVerifyCodeSaga({ payload }: any) {
  try {
    const { status } = yield call(authService.checkVerifyCode, payload);
    if (status === STATUS_CODE.SUCCESS) {
      // Do nothing
    } else {
      const { navigate } = yield select((state) => state.functionReducer);

      navigate('/forgot');
    }
  } catch (err: any) {
    const { navigate } = yield select((state) => state.functionReducer);

    navigate('/forgot');
    console.log(err);
  }
}

export function* theoDoiCheckVerifyCodeSaga() {
  yield takeLatest(CHECK_VERIFY_CODE_SAGA, CheckVerifyCodeSaga);
}

// Check Reset Password Saga
function* CheckResetPasswordSaga({ payload }: any) {
  try {
    const { status } = yield call(authService.checkResetPassword, payload);
    if (status === STATUS_CODE.SUCCESS) {
      // Do nothing
    } else {
      const { navigate } = yield select((state) => state.functionReducer);

      navigate('/forgot');
    }
  } catch (err: any) {
    const { navigate } = yield select((state) => state.functionReducer);

    navigate('/forgot');
    console.log(err);
  }
}

export function* theoDoiCheckResetPasswordSaga() {
  yield takeLatest(CHECK_RESET_PASSWORD_SAGA, CheckResetPasswordSaga);
}
