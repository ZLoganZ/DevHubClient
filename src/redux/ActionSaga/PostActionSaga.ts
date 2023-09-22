import { createAction } from '@reduxjs/toolkit';

import {
  CreateCommentDataType,
  CreateLikeCommentType,
  CreatePostType,
  SharePostDataType,
  UpdatePostDataType
} from '@/types';

export const CREATE_POST_SAGA = createAction(
  'post/create_post',
  (data: CreatePostType) => ({
    payload: data
  })
);
export const GET_ALL_POST_BY_USERID_SAGA = createAction(
  'post/get_all_post_by_userID',
  (data: { userID: string }) => ({ payload: data })
);
export const DELETE_POST_SAGA = createAction(
  'post/delete_post',
  (data: { id: string }) => ({
    payload: data
  })
);
export const LIKE_POST_SAGA = createAction(
  'post/like_post',
  (data: SharePostDataType) => ({
    payload: data
  })
);
export const SHARE_POST_SAGA = createAction(
  'post/share_post',
  (data: SharePostDataType) => ({
    payload: data
  })
);
export const SAVE_POST_SAGA = createAction(
  'post/save_post',
  (data: { id: string }) => ({
    payload: data
  })
);
export const UPDATE_POST_SAGA = createAction(
  'post/update_post',
  (data: UpdatePostDataType) => ({
    payload: data
  })
);
export const SAVE_COMMENT_SAGA = createAction(
  'post/save_comment',
  (data: CreateCommentDataType) => ({
    payload: data
  })
);
export const GET_POST_BY_ID_SAGA = createAction(
  'post/get_post_by_id',
  (data: { id: string }) => ({ payload: data })
);
export const GET_ALL_POST_SAGA = createAction('post/get_all_post');
export const INCREASE_VIEW_SAGA = createAction(
  'post/increase_view',
  (data: { id: string }) => ({
    payload: data
  })
);
export const LIKE_COMMENT_POST_SAGA = createAction(
  'post/like_comment_post',
  (data: CreateLikeCommentType) => ({ payload: data })
);
export const DISLIKE_COMMENT_POST_SAGA = createAction(
  'post/dislike_comment_post',
  (data: CreateLikeCommentType) => ({ payload: data })
);
