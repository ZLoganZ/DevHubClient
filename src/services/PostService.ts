import { AxiosResponse } from 'axios';

import { PostType, UserInfoType } from '@/types';
import { BaseService } from './BaseService';

type PostsType = {
  userInfo?: UserInfoType;
  content?: PostType[];
  ownerInfo?: UserInfoType;
};

export class PostService extends BaseService {
  constructor() {
    super();
  }

  getAllPostByUserID = (
    id: String | null
  ): Promise<AxiosResponse<PostsType>> => {
    return this.get(`/${id}/posts`);
  };
  getAllPost = (): Promise<AxiosResponse<PostsType>> => {
    return this.get(`/posts/all`);
  };
  createPost = (post: any) => {
    return this.post(`/posts`, post);
  };
  updatePost = (id: string, post: any) => {
    return this.put(`/posts/update/${id}`, post);
  };
  deletePost = ({ id }: any) => {
    return this.delete(`/posts/delete/${id}`);
  };
  likePost = (id: string) => {
    return this.post(`/posts/${id}/like`, '');
  };
  sharePost = (id: string) => {
    return this.post(`/posts/share`, '');
  };
  savePost = (id: string) => {
    return this.post(`/posts/${id}/save`, '');
  };
  saveComment = (id: string, commentContent: any) => {
    return this.post(`/posts/${id}/comment`, commentContent);
  };
  saveReply = (id: string, replyContent: any) => {
    return this.post(
      `/posts/${id}/comment/${replyContent.idComment}`,
      replyContent
    );
  };
  saveCommentPostShare = (id: string, commentContent: any) => {
    return this.post(`/postshare/${id}/comment`, commentContent);
  };
  likePostShare = (id: string) => {
    return this.post(`/postshare/${id}/like`, '');
  };
  saveReplyPostShare = (id: string, replyContent: any) => {
    return this.post(
      `/postshare/${id}/comment/${replyContent.idComment}`,
      replyContent
    );
  };
  getPostById = (id: string) => {
    return this.get(`/posts/find/${id}`);
  };
  getPostShareById = (id: string) => {
    return this.get(`/postshares/${id}`);
  };
  increaseViewPost = (id: string) => {
    return this.post(`/posts/${id}/views`, null);
  };
  increaseViewPostShare = (id: string) => {
    return this.post(`/postshare/${id}/views`, null);
  };
  likeCommentPost = (id: string) => {
    return this.post(`/comment/${id}/like`, '');
  };
  dislikeCommentPost = (id: string) => {
    return this.post(`/comment/${id}/dislike`, '');
  };
}

export const postService = new PostService();
