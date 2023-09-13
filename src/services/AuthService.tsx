import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  constructor() {
    super();
  }

  checkLogin = (token: any) => {
    return this.post(`/checklogin`, token);
  };
  registerUser = (userRegister: any) => {
    return this.post(`/auth/signup`, userRegister);
  };
  login = (user: any) => {
    return this.post(`/auth/login`, user);
  };
  loginWithGoogle = (token: any) => {
    return this.post(`/auth/googleV2`, token);
  };
  logout = (token: any) => {
    return this.post(`/logout`, token);
  };
  getUserID = (token: any) => {
    return this.get(`/getUserID`);
  };
  forgotPassword = (email: string) => {
    return this.post(`/forgot`, email);
  };
  verifyCode = (data: object) => {
    return this.post(`/verify`, data);
  };
  checkVerifyCode = (data: object) => {
    return this.post(`/checkVerify`, data);
  };
  resetPassword = (data: object) => {
    return this.post(`/reset`, data);
  };
  checkResetPassword = (data: object) => {
    return this.post(`/checkReset`, data);
  };
}

export const authService = new AuthService();
