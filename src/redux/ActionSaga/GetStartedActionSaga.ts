import { createAction } from '@reduxjs/toolkit';

export const CHOOSE_GET_STARTED_SAGA = createAction('CHOOSE_GET_STARTED_SAGA', (data) => ({
  payload: data
}));
export const CHOOSE_GET_INTEREST_SAGA = createAction('CHOOSE_GET_INTEREST_SAGA', (data) => ({
  payload: data
}));
export const CHOOSE_SHOULD_FRIEND_SAGA = createAction('CHOOSE_SHOULD_FRIEND_SAGA', (data) => ({
  payload: data
}));

export const GET_SHOULD_FRIENDS_SAGA = createAction('GET_FRIENDS_SAGA');
