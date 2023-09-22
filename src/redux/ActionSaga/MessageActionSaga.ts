import { createAction } from '@reduxjs/toolkit';

export const GET_CONVERSATIONS_SAGA = createAction('GET_CONVERSATIONS_SAGA');

export const CREATE_CONVERSATION_SAGA = createAction('CREATE_CONVERSATION_SAGA', (payload: any) => ({ payload }));

export const GET_CONVERSATION_SAGA = createAction('GET_CONVERSATION_SAGA', (payload: any) => ({ payload }));

export const GET_MESSAGES_SAGA = createAction('GET_MESSAGES_SAGA', (payload: any) => ({ payload }));

export const SEEN_MESSAGE_SAGA = createAction('SEEN_MESSAGE_SAGA', (payload: any) => ({ payload }));

export const SEND_MESSAGE_SAGA = createAction('SEND_MESSAGE_SAGA', (payload: any) => ({ payload }));