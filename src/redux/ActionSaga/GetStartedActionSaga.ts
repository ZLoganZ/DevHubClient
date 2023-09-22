import { createAction } from '@reduxjs/toolkit';

export const CHOOSE_GET_STARTED_SAGA = createAction('CHOOSE_GET_STARTED_SAGA', (data) => ({
  payload: data,
}));
export const CHOOSE_GET_INTEREST_SAGA = createAction('CHOOSE_GET_INTEREST_SAGA', (data) => ({
  payload: data,
}));
export const CHOOSE_SHOULD_FOLLOW_SAGA = createAction('CHOOSE_SHOULD_FOLLOW_SAGA', (data) => ({
  payload: data,
}));

export const GET_SHOULD_FOLLOWERS_SAGA = createAction('GET_FOLLOWERS_SAGA');
