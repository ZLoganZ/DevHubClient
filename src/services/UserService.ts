import { AxiosResponse } from 'axios';

import {
  RepositoryType,
  ResponseType,
  UserUpdateDataType,
  UserInfoType
} from '@/types';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
  constructor() {
    super();
  }

  updateUser = (
    userUpdate: UserUpdateDataType
  ): Promise<AxiosResponse<ResponseType<UserInfoType>>> => {
    return this.put(`/users/update`, userUpdate);
  };
  getFollowers = (
    userID: string
  ): Promise<AxiosResponse<ResponseType<UserInfoType[]>>> => {
    return this.get(`/users/followers/${userID}`);
  };
  getFollowing = (
    userID: string
  ): Promise<AxiosResponse<ResponseType<UserInfoType[]>>> => {
    return this.get(`/users/following/${userID}`);
  };
  getShouldFollow = (): Promise<
    AxiosResponse<ResponseType<UserInfoType[]>>
  > => {
    return this.get(`/users/shouldfollow`);
  };
  getUserInfo = (): Promise<AxiosResponse<ResponseType<UserInfoType>>> => {
    return this.get(`/users/me`);
  };
  getUserInfoByID = (
    userID: string
  ): Promise<AxiosResponse<ResponseType<UserInfoType>>> => {
    return this.get(`/users/find/${userID}`);
  };
  followUser = (userID: string) => {
    return this.post(`/users/follow/${userID}`, '');
  };
  getRepositoryGithub = (): Promise<
    AxiosResponse<ResponseType<RepositoryType[]>>
  > => {
    return this.getgithub(`/users/repositories`);
  };
}

export const userService = new UserService();
