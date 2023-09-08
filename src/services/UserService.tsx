import { BaseService } from './BaseService';

export class UserService extends BaseService {
  constructor() {
    super();
  }

  registerUser = (userRegister: any) => {
    return this.post(`/users`, userRegister);
  };
  updateUser = (userID: any, userUpdate: any) => {
    return this.put(`/users/${userID}`, userUpdate);
  };
  getFollowers = () => {
    return this.get(`/user/followers`);
  };
  getUserInfo = () => {
    return this.get(`/users/me`);
  };
  followUser = (userID: any) => {
    return this.post(`/users/${userID}/follow`, '');
  };
  getRepositoryGithub = () => {
    return this.getgithub(`/user/github`);
  };
}

export const userService = new UserService();
