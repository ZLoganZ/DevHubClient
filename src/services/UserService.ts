import { AxiosResponse } from 'axios';

import { IRepository, IResponse, IUserUpdate, IUserInfo } from '@/types';
import { BaseService } from './BaseService';

class UserService extends BaseService {
  constructor() {
    super();
  }

  updateUser = (userUpdate: IUserUpdate): Promise<AxiosResponse<IResponse<IUserInfo>>> => {
    return this.put(`/users/update`, userUpdate);
  };
  getFollowers = (userID: string): Promise<AxiosResponse<IResponse<IUserInfo[]>>> => {
    return this.get(`/users/followers/${userID}`);
  };
  getFollowing = (userID: string): Promise<AxiosResponse<IResponse<IUserInfo[]>>> => {
    return this.get(`/users/following/${userID}`);
  };
  getShouldFollow = (): Promise<AxiosResponse<IResponse<IUserInfo[]>>> => {
    return this.get(`/users/shouldfollow`);
  };
  getUserInfo = (): Promise<AxiosResponse<IResponse<IUserInfo>>> => {
    return this.get(`/users/me`);
  };
  getUserInfoByID = (userID: string): Promise<AxiosResponse<IResponse<IUserInfo>>> => {
    return this.get(`/users/find/${userID}`);
  };
  followUser = (userID: string): Promise<AxiosResponse<IResponse<boolean>>> => {
    return this.put(`/users/follow/${userID}`, '');
  };
  getRepositoryGithub = (): Promise<AxiosResponse<IResponse<IRepository[]>>> => {
    return this.getGithub(`/users/repositories`);
  };
}

export const userService = new UserService();
