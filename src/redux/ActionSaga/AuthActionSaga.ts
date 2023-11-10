import { createAction } from '@reduxjs/toolkit';

import {
  IForgotPassword,
  IGoogleLogin,
  IResetPassword,
  IUserLogin,
  IUserRegister,
  IVerifyCode
} from '@/types';

export const LOGIN_SAGA = createAction('LOGIN_SAGA', (data: IUserLogin) => ({
  payload: data
}));

export const REGISTER_SAGA = createAction('REGIS_USER_SAGA', (data: IUserRegister) => ({
  payload: data
}));

export const LOGIN_WITH_GOOGLE_SAGA = createAction('LOGIN_WITH_GOOGLE_SAGA', (data: IGoogleLogin) => ({
  payload: data
}));

export const LOGOUT_SAGA = createAction('LOGOUT_SAGA');

export const FORGOT_PASSWORD_SAGA = createAction('FORGOT_PASSWORD_SAGA', (data: IForgotPassword) => ({
  payload: data
}));

export const VERIFY_CODE_SAGA = createAction('VERIFY_CODE_SAGA', (data: IVerifyCode) => ({
  payload: data
}));

export const RESET_PASSWORD_SAGA = createAction('RESET_PASSWORD_SAGA', (data: IResetPassword) => ({
  payload: data
}));

export const CHECK_VERIFY_CODE_SAGA = createAction('CHECK_VERIFY_CODE_SAGA', (data: IForgotPassword) => ({
  payload: data
}));

export const CHECK_RESET_PASSWORD_SAGA = createAction(
  'CHECK_RESET_PASSWORD_SAGA',
  (data: IForgotPassword) => ({
    payload: data
  })
);
