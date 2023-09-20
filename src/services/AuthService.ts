import {
  GoogleLoginDataType,
  UserLoginDataType,
  UserATokenType,
  UserRegisterDataType,
  VerifyCodeDataType,
  ForgotPasswordDataType,
  ResetPasswordDataType
} from '@/types';
import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  constructor() {
    super();
  }
  register = (userRegister: UserRegisterDataType) => {
    return this.post(`/auth/signup`, userRegister);
  };
  login = (userLogin: UserLoginDataType) => {
    return this.post(`/auth/login`, userLogin);
  };
  loginWithGoogle = (token: GoogleLoginDataType) => {
    return this.post(`/auth/googleV2`, token);
  };
  logout = () => {
    return this.post(`/logout`);
  };
  forgotPassword = (email: string) => {
    return this.post(`/forgot`, email);
  };
  verifyCode = (data: VerifyCodeDataType) => {
    return this.post(`/verify`, data);
  };
  checkVerifyCode = (data: ForgotPasswordDataType) => {
    return this.post(`/checkVerify`, data);
  };
  resetPassword = (data: ResetPasswordDataType) => {
    return this.post(`/reset`, data);
  };
  checkResetPassword = (data: ForgotPasswordDataType) => {
    return this.post(`/checkReset`, data);
  };
}

export const authService = new AuthService();
