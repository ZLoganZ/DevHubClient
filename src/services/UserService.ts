import { BaseService } from './BaseService';

export class UserService extends BaseService {
  constructor() {
    super();
  }

  updateUser = (userUpdate: any) => {
    return this.put(`/users/update`, userUpdate);
  };
  getFollowers = (userID: string) => {
    return this.get(`/users/followers/${userID}`);
  };
  getFollowing = (userID: string) => {
    return this.get(`/users/following/${userID}`);
  };
  getShouldFollow = () => {
    return this.get(`/users/shouldfollow`);
  };
  getUserInfo = () => {
    return this.get(`/users/me`);
  };
  followUser = (userID: string) => {
    return this.post(`/users/follow/${userID}`, '');
  };
  getRepositoryGithub = () => {
    return this.getgithub(`/users/repositories`);
  };
}

export const userService = new UserService();
