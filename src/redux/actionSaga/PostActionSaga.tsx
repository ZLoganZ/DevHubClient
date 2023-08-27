import { createAction } from '@reduxjs/toolkit';

export const CREATE_POST_SAGA = createAction('CREATE_POST_SAGA', (data) => ({
  payload: data,
}));
export const GET_ALL_POST_BY_USERID_SAGA = createAction('GET_ALL_POST_BY_USERID_SAGA', (data) => ({ payload: data }));
export const DELETE_POST_SAGA = createAction('DELETE_POST_SAGA', (data) => ({
  payload: data,
}));
export const LIKE_POST_SAGA = createAction('LIKE_POST_SAGA', (data) => ({
  payload: data,
}));
export const SHARE_POST_SAGA = createAction('SHARE_POST_SAGA', (data) => ({
  payload: data,
}));
export const SAVE_POST_SAGA = createAction('SAVE_POST_SAGA', (data) => ({
  payload: data,
}));
export const UPDATE_POST_SAGA = createAction('UPDATE_POST_SAGA', (data) => ({
  payload: data,
}));
export const SAVE_COMMENT_SAGA = createAction('SAVE_COMMENT_SAGA', (data) => ({
  payload: data,
}));
export const SAVE_REPLY_SAGA = createAction('SAVE_REPLY_SAGA', (data) => ({
  payload: data,
}));
export const SAVE_COMMENT_POSTSHARE_SAGA = createAction('SAVE_COMMENT_POSTSHARE_SAGA', (data) => ({ payload: data }));
export const LIKE_POSTSHARE_SAGA = createAction('LIKE_POSTSHARE_SAGA', (data) => ({ payload: data }));
export const SAVE_REPLY_POSTSHARE_SAGA = createAction('SAVE_REPLY_POSTSHARE_SAGA', (data) => ({ payload: data }));
export const GET_POST_BY_ID_SAGA = createAction('GET_POST_BY_ID_SAGA', (data) => ({ payload: data }));
export const GET_POSTSHARE_BY_ID_SAGA = createAction('GET_POSTSHARE_BY_ID_SAGA', (data) => ({ payload: data }));
export const GET_ALL_POST_SAGA = createAction('GET_ALL_POST_SAGA');
export const INCREASE_VIEW_SAGA = createAction('INCREASE_VIEW_SAGA', (data) => ({
  payload: data,
}));
export const INCREASE_VIEW_SHARE_SAGA = createAction('INCREASE_VIEW_SHARE_SAGA', (data) => ({
  payload: data,
}));
export const LIKE_COMMENT_POST_SAGA = createAction('LIKE_COMMENT_POST_SAGA', (data) => ({ payload: data }));
export const DISLIKE_COMMENT_POST_SAGA = createAction('DISLIKE_COMMENT_POST_SAGA', (data) => ({ payload: data }));
