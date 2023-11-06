import { AxiosResponse } from 'axios';

import {
  ICommentPost,
  ICreateComment,
  ICreatePost,
  IGetChildComments,
  ILikeComment,
  IPost,
  IResponse,
  ISharePost
} from '@/types';
import { BaseService } from './BaseService';

class PostService extends BaseService {
  constructor() {
    super();
  }

  getAllPostByUserID = (id: string): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/user/${id}`);
  };
  getAllPost = (): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/all`);
  };
  getAllPostNewsFeed = (): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/newsfeed`);
  };
  getAllPopularPost = (sort: string): Promise<AxiosResponse<IResponse<IPost[]>>> => {
    return this.get(`/posts/popular/?sortBy=${sort}`);
  };
  createPost = (post: ICreatePost): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.post(`/posts`, post);
  };
  updatePost = (id: string, post: ICreatePost): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.put(`/posts/update/${id}`, post);
  };
  deletePost = (id: string) => {
    return this.delete(`/posts/delete/${id}`);
  };
  likePost = (post: ISharePost) => {
    return this.put(`/users/likepost`, post);
  };
  sharePost = (sharepost: ISharePost) => {
    return this.post(`/posts/share`, sharepost);
  };
  savePost = (id: string) => {
    return this.put(`/users/savepost/${id}`);
  };
  getParentComments = (id: string): Promise<AxiosResponse<IResponse<ICommentPost[]>>> => {
    return this.get(`/comments/parents/${id}`);
  };
  getChildComments = (comment: IGetChildComments): Promise<AxiosResponse<IResponse<ICommentPost[]>>> => {
    return this.get(`/comments/children`, comment);
  };
  createComment = (comment: ICreateComment) => {
    return this.post(`/comments/create`, comment);
  };
  getPostByID = (id: string): Promise<AxiosResponse<IResponse<IPost>>> => {
    return this.get(`/posts/find/${id}`);
  };
  viewPost = (id: string) => {
    return this.put(`/posts/view/${id}`);
  };
  likeComment = (id: string, payload: ILikeComment) => {
    return this.put(`/comments/like/${id}`, payload);
  };
  dislikeComment = (id: string, payload: ILikeComment) => {
    return this.put(`/comments/dislike/${id}`, payload);
  };
}

export const postService = new PostService();
