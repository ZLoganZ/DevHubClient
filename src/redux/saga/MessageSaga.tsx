import { call, put, select, takeLatest } from 'redux-saga/effects';
import { messageService } from '@/services/MessageService';
import STATUS_CODE from '@/utils/constants/statusCodes';
import {
  CREATE_CONVERSATION_SAGA,
  GET_CONVERSATIONS_SAGA,
  GET_CONVERSATION_SAGA,
  GET_MESSAGES_SAGA,
  SEEN_MESSAGE_SAGA,
  SEND_MESSAGE_SAGA,
} from '../actionSaga/MessageActionSaga';
import {
  AddConversations,
  SetConversations,
  SetCurrentConversation,
  SetMessage,
  SetMessages,
} from '../Slice/ConversationSlice';

// Get conversations Saga
export function* getConversationsSaga() {
  try {
    const { data, status } = yield call(messageService.getConversations);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetConversations(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetConversationsSaga() {
  yield takeLatest(GET_CONVERSATIONS_SAGA, getConversationsSaga);
}

// Create conversation Saga
export function* createConversationSaga({ payload }: any) {
  try {
    const { data, status } = yield call(messageService.createConversation, payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(AddConversations(data.content));
      yield put(SetCurrentConversation(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiCreateConversationSaga() {
  yield takeLatest(CREATE_CONVERSATION_SAGA, createConversationSaga);
}

// Get conversation Saga
export function* getConversationSaga({ payload }: any) {
  try {
    const { data, status } = yield call(messageService.getConversation, payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(SetCurrentConversation(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
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
      yield put(SetMessages(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
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
      yield put(SetCurrentConversation(data.content));
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
      yield put(SetMessage(data.content));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiSendMessageSaga() {
  yield takeLatest(SEND_MESSAGE_SAGA, sendMessageSaga);
}
