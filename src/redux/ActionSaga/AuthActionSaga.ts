import { createAction } from '@reduxjs/toolkit';

import {
  ForgotPasswordDataType,
  GoogleLoginDataType,
  ResetPasswordDataType,
  UserLoginDataType,
  UserRegisterDataType,
  VerifyCodeDataType
} from '@/types';

export const LOGIN_SAGA = createAction(
  'LOGIN_SAGA',
  (data: UserLoginDataType) => ({
    payload: data
  })
);

export const REGISTER_SAGA = createAction(
  'REGIS_USER_SAGA',
  (data: UserRegisterDataType) => ({
    payload: data
  })
);

export const LOGIN_WITH_GOOGLE_SAGA = createAction(
  'LOGIN_WITH_GOOGLE_SAGA',
  (data: GoogleLoginDataType) => ({
    payload: data
  })
);

export const LOGOUT_SAGA = createAction('LOGOUT_SAGA');

export const FORGOT_PASSWORD_SAGA = createAction(
  'FORGOT_PASSWORD_SAGA',
  (data: ForgotPasswordDataType) => ({
    payload: data
  })
);

export const VERIFY_CODE_SAGA = createAction(
  'VERIFY_CODE_SAGA',
  (data: VerifyCodeDataType) => ({
    payload: data
  })
);

export const RESET_PASSWORD_SAGA = createAction(
  'RESET_PASSWORD_SAGA',
  (data: ResetPasswordDataType) => ({
    payload: data
  })
);

export const CHECK_VERIFY_CODE_SAGA = createAction(
  'CHECK_VERIFY_CODE_SAGA',
  (data: ForgotPasswordDataType) => ({
    payload: data
  })
);

export const CHECK_RESET_PASSWORD_SAGA = createAction(
  'CHECK_RESET_PASSWORD_SAGA',
  (data: ForgotPasswordDataType) => ({
    payload: data
  })
);
