import { AxiosResponse } from 'axios';

import {
  CommentType,
  CreateCommentDataType,
  CreatePostDataType,
  GetChildCommentsType,
  LikeCommentType,
  PostType,
  ResponseType,
  SharePostDataType
} from '@/types';
import { BaseService } from './BaseService';

export class PostService extends BaseService {
  constructor() {
    super();
  }

  getAllPostByUserID = (
    id: string
  ): Promise<AxiosResponse<ResponseType<PostType[]>>> => {
    return this.get(`/posts/user/${id}`);
  };
  getAllPost = (): Promise<AxiosResponse<ResponseType<PostType[]>>> => {
    return this.get(`/posts/all`);
  };
  GetAllPostNewsFeed = (): Promise<AxiosResponse<ResponseType<PostType[]>>> => {
    return this.get(`/posts/newsfeed`);
  };
  createPost = (
    post: CreatePostDataType
  ): Promise<AxiosResponse<ResponseType<PostType>>> => {
    return this.post(`/posts`, post);
  };
  updatePost = (
    id: string,
    post: CreatePostDataType
  ): Promise<AxiosResponse<ResponseType<PostType>>> => {
    return this.put(`/posts/update/${id}`, post);
  };
  deletePost = (id: string) => {
    return this.delete(`/posts/delete/${id}`);
  };
  likePost = (post: SharePostDataType) => {
    return this.post(`/users/likepost`, post);
  };
  sharePost = (sharepost: SharePostDataType) => {
    return this.post(`/posts/share`, sharepost);
  };
  savePost = (id: string) => {
    return this.post(`/users/savepost/${id}`);
  };
  getParentComments = (
    id: string
  ): Promise<AxiosResponse<ResponseType<CommentType[]>>> => {
    return this.get(`/comments/parents/${id}`);
  };
  getChildComments = (
    comment: GetChildCommentsType
  ): Promise<AxiosResponse<ResponseType<CommentType[]>>> => {
    return this.get(`/comments/children`, comment);
  };
  createComment = (comment: CreateCommentDataType) => {
    return this.post(`/comments/create`, comment);
  };
  getPostByID = (
    id: string
  ): Promise<AxiosResponse<ResponseType<PostType>>> => {
    return this.get(`/posts/find/${id}`);
  };
  viewPost = (id: string) => {
    return this.put(`/posts/view/${id}`, null);
  };
  likeComment = (id: string, payload: LikeCommentType) => {
    return this.post(`/comments/like/${id}`, payload);
  };
  dislikeCommentPost = (id: string, payload: LikeCommentType) => {
    return this.post(`/comment/dislike/${id}`, payload);
  };
}

export const postService = new PostService();
