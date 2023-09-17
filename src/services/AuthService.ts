import {
  GoogleLoginType,
  UserLoginType,
  UserATokenType,
  UserRegisterType,
  VerifyCodeType,
  ForgotPasswordType,
  ResetPasswordType
} from '@/types';
import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  constructor() {
    super();
  }

  checkLogin = (token: UserATokenType) => {
    return this.post(`/checklogin`, token);
  };
  register = (userRegister: UserRegisterType) => {
    return this.post(`/auth/signup`, userRegister);
  };
  login = (userLogin: UserLoginType) => {
    return this.post(`/auth/login`, userLogin);
  };
  loginWithGoogle = (token: GoogleLoginType) => {
    return this.post(`/auth/googleV2`, token);
  };
  logout = (token: UserATokenType) => {
    return this.post(`/logout`, token);
  };
  getUserID = () => {
    return this.get(`/getUserID`);
  };
  forgotPassword = (email: string) => {
    return this.post(`/forgot`, email);
  };
  verifyCode = (data: VerifyCodeType) => {
    return this.post(`/verify`, data);
  };
  checkVerifyCode = (data: ForgotPasswordType) => {
    return this.post(`/checkVerify`, data);
  };
  resetPassword = (data: ResetPasswordType) => {
    return this.post(`/reset`, data);
  };
  checkResetPassword = (data: ForgotPasswordType) => {
    return this.post(`/checkReset`, data);
  };
}

export const authService = new AuthService();
