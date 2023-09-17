import { FollowResponseType, UserInfoResponseType } from './../types/index';
import { AxiosResponse } from 'axios';

import { UpdateUserResponseType, UpdateUserType } from '@/types';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
  constructor() {
    super();
  }

  updateUser = (
    userUpdate: UpdateUserType
  ): Promise<AxiosResponse<UpdateUserResponseType>> => {
    return this.put(`/users/update`, userUpdate);
  };
  getFollowers = (
    userID: string
  ): Promise<AxiosResponse<FollowResponseType>> => {
    return this.get(`/users/followers/${userID}`);
  };
  getFollowing = (
    userID: string
  ): Promise<AxiosResponse<FollowResponseType>> => {
    return this.get(`/users/following/${userID}`);
  };
  getShouldFollow = (): Promise<AxiosResponse<FollowResponseType[]>> => {
    return this.get(`/users/shouldfollow`);
  };
  getUserInfo = (): Promise<AxiosResponse<UserInfoResponseType>> => {
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
