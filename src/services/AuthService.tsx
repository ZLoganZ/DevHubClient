import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  constructor() {
    super();
  }

  checkLogin = (token: object) => {
    return this.post(`/checklogin`, token);
  };
  login = (user: unknown) => {
    return this.post(`/login`, user);
  };
  loginWithGoogle = (token: string) => {
    return this.post(`/auth/googleV2`, token);
  };
  logout = (token: object) => {
    return this.post(`/logout`, token);
  };
  getUserID = () => {
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
