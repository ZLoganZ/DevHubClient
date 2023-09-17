import { createAction } from '@reduxjs/toolkit';

import {
  ForgotPasswordType,
  GoogleLoginType,
  ResetPasswordType,
  UserLoginType,
  UserRegisterType,
  VerifyCodeType
} from '@/types';

export const LOGIN_SAGA = createAction('LOGIN_SAGA', (data: UserLoginType) => ({
  payload: data
}));

export const REGISTER_SAGA = createAction(
  'REGIS_USER_SAGA',
  (data: UserRegisterType) => ({
    payload: data
  })
);

export const LOGIN_WITH_GOOGLE_SAGA = createAction(
  'LOGIN_WITH_GOOGLE_SAGA',
  (data: GoogleLoginType) => ({
    payload: data
  })
);

export const LOGOUT_SAGA = createAction('LOGOUT_SAGA');

export const GET_USER_ID = createAction('GET_USER_ID');

export const CHECK_LOGIN_SAGA = createAction('CHECK_LOGIN_SAGA');

export const FORGOT_PASSWORD_SAGA = createAction(
  'FORGOT_PASSWORD_SAGA',
  (data: ForgotPasswordType) => ({
    payload: data
  })
);

export const VERIFY_CODE_SAGA = createAction(
  'VERIFY_CODE_SAGA',
  (data: VerifyCodeType) => ({
    payload: data
  })
);

export const RESET_PASSWORD_SAGA = createAction(
  'RESET_PASSWORD_SAGA',
  (data: ResetPasswordType) => ({
    payload: data
  })
);

export const CHECK_VERIFY_CODE_SAGA = createAction(
  'CHECK_VERIFY_CODE_SAGA',
  (data: ForgotPasswordType) => ({
    payload: data
  })
);

export const CHECK_RESET_PASSWORD_SAGA = createAction(
  'CHECK_RESET_PASSWORD_SAGA',
  (data: ForgotPasswordType) => ({
    payload: data
  })
);
