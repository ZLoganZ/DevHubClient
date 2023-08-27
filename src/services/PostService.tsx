import { BaseService } from "./BaseService";

interface IComment {
  id: string;
}

export class PostService extends BaseService {
  constructor() {
    super();
  }

  getAllPostByUserID = (id: string | null) => {
    return this.get(`/${id}/posts`);
  };
  getAllPost = () => {
    return this.get(`/posts`);
  };
  createPost = (post: any) => {
    return this.post(`/posts`, post);
  };
  updatePost = (id: string, post: any) => {
    return this.put(`/posts/${id}`, post);
  };
  deletePost = (id: string) => {
    return this.delete(`/posts/${id}`);
  };
  likePost = (id: string) => {
    return this.post(`/posts/${id}/like`, "");
  };
  sharePost = (id: string) => {
    return this.post(`/posts/${id}/share`, "");
  };
  savePost = (id: string) => {
    return this.post(`/posts/${id}/save`, "");
  };
  saveComment = (id: string, commentContent: IComment) => {
    return this.post(`/posts/${id}/comment`, commentContent);
  };
  saveReply = (id: string, replyContent: IComment) => {
    return this.post(`/posts/${id}/comment/${replyContent.id}`, replyContent);
  };
  saveCommentPostShare = (id: string, commentContent: IComment) => {
    return this.post(`/postshare/${id}/comment`, commentContent);
  };
  likePostShare = (id: string) => {
    return this.post(`/postshare/${id}/like`, "");
  };
  saveReplyPostShare = (id: string, replyContent: IComment) => {
    return this.post(
      `/postshare/${id}/comment/${replyContent.id}`,
      replyContent
    );
  };
  getPostById = (id: string) => {
    return this.get(`/posts/${id}`);
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
    return this.post(`/comment/${id}/like`, "");
  };
  dislikeCommentPost = (id: string) => {
    return this.post(`/comment/${id}/dislike`, "");
  };
}

export const postService = new PostService();
