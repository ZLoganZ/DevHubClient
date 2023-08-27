import { createAction } from '@reduxjs/toolkit';

export const REGIS_USER_SAGA = createAction('REGIS_USER_SAGA', (data) => ({
  payload: data,
}));

export const UPDATE_USER_SAGA = createAction('UPDATE_USER_SAGA', (data) => ({
  payload: data,
}));

export const GET_FOLLOWERS_SAGA = createAction('GET_FOLLOWERS_SAGA');

export const GET_USER_INFO_SAGA = createAction('GET_USER_INFO_SAGA');

export const FOLLOW_USER_SAGA = createAction('FOLLOW_USER_SAGA', (data) => ({
  payload: data,
}));

export const GET_REPOSITORY_SAGA = createAction('GET_REPOSITORY_SAGA');