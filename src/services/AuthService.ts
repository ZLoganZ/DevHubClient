import {
  IGoogleLogin,
  IUserLogin,
  IUserRegister,
  IVerifyCode,
  IForgotPassword,
  IResetPassword
} from '@/types';
import { BaseService } from './BaseService';

class AuthService extends BaseService {
  constructor() {
    super();
  }
  register = (userRegister: IUserRegister) => {
    return this.post(`/auth/signup`, userRegister);
  };
  login = (userLogin: IUserLogin) => {
    return this.post(`/auth/login`, userLogin);
  };
  loginWithGoogle = (token: IGoogleLogin) => {
    return this.post(`/auth/googleV2`, token);
  };
  logout = () => {
    return this.post(`/auth/logout`);
  };
  forgotPassword = (email: string) => {
    return this.post(`/forgot`, email);
  };
  verifyCode = (data: IVerifyCode) => {
    return this.post(`/verify`, data);
  };
  checkVerifyCode = (data: IForgotPassword) => {
    return this.post(`/checkVerify`, data);
  };
  resetPassword = (data: IResetPassword) => {
    return this.post(`/reset`, data);
  };
  checkResetPassword = (data: IForgotPassword) => {
    return this.post(`/checkReset`, data);
  };
}

export const authService = new AuthService();
