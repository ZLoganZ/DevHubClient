import { call, put, takeLatest } from 'redux-saga/effects';

import {
  CREATE_CONVERSATION_SAGA,
  GET_CONVERSATIONS_SAGA,
  GET_CONVERSATION_SAGA,
  GET_MESSAGES_SAGA,
  SEEN_MESSAGE_SAGA,
  SEND_MESSAGE_SAGA
} from '@/redux/ActionSaga/MessageActionSaga';
import {
  AddConversations,
  SetConversations,
  SetCurrentConversation,
  SetMessage,
  SetMessages
} from '@/redux/Slice/ConversationSlice';

import { messageService } from '@/services/MessageService';
import { STATUS_CODE } from '@/util/constants/SettingSystem';

// Get conversations Saga
export function* getConversationsSaga() {
  try {
    const { data, status } = yield call(messageService.getConversations);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetConversations(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetConversationsSaga() {
  yield takeLatest(GET_CONVERSATIONS_SAGA, getConversationsSaga);
}

// Create conversation Saga
export function* createConversationSaga({ payload }: any) {
  try {
    const { data, status } = yield call(
      messageService.createConversation,
      payload
    );
    if (status === STATUS_CODE.SUCCESS) {
      yield put(AddConversations(data.metadata));
      yield put(SetCurrentConversation(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiCreateConversationSaga() {
  yield takeLatest(CREATE_CONVERSATION_SAGA, createConversationSaga);
}

// Get conversation Saga
export function* getConversationSaga({ payload }: any) {
  try {
    const { data, status } = yield call(
      messageService.getConversation,
      payload
    );
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetCurrentConversation(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetConversationSaga() {
  yield takeLatest(GET_CONVERSATION_SAGA, getConversationSaga);
}

// Get messages Saga
export function* getMessagesSaga({ payload }: any) {
  try {
    const { data, status } = yield call(messageService.getMessages, payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetMessages(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetMessagesSaga() {
  yield takeLatest(GET_MESSAGES_SAGA, getMessagesSaga);
}

// Seen message Saga
export function* seenMessageSaga({ payload }: any) {
  try {
    const { data, status } = yield call(messageService.seenMessage, payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetCurrentConversation(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiSeenMessageSaga() {
  yield takeLatest(SEEN_MESSAGE_SAGA, seenMessageSaga);
}

// Send message Saga
export function* sendMessageSaga({ payload }: any) {
  try {
    const { data, status } = yield call(messageService.sendMessage, payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetMessage(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiSendMessageSaga() {
  yield takeLatest(SEND_MESSAGE_SAGA, sendMessageSaga);
}
