import { createAction } from '@reduxjs/toolkit';

export const GET_COMMUNITY_BY_ID_SAGA = createAction('GET_COMMUNITY_BY_ID_SAGA', (data) => ({
  payload: data,
}));
