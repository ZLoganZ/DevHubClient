import { AxiosResponse } from 'axios';
import { BaseService } from './BaseService';
import {
  ConversationType,
  CreateConversationDataType,
  CreateMessageDataType,
  MessageType,
  ResponseType,
  SocketCallType
} from '@/types';

class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = (): Promise<AxiosResponse<ResponseType<ConversationType[]>>> => {
    return this.get(`/chat/conversations`);
  };

  createConversation = (
    payload: CreateConversationDataType
  ): Promise<AxiosResponse<ResponseType<ConversationType>>> => {
    return this.post(`/chat/conversations/create`, payload);
  };

  getConversation = (payload: string): Promise<AxiosResponse<ResponseType<ConversationType>>> => {
    return this.get(`/chat/conversations/find/${payload}`);
  };

  getMessages = (
    payload: string,
    page: number,
    extend?: number
  ): Promise<AxiosResponse<ResponseType<MessageType[]>>> => {
    return this.get(`/chat/conversations/${payload}/messages?page=${page}&extend=${extend}`);
  };

  seenMessage = (payload: string) => {
    return this.post(`/chat/conversations/${payload}/seen`, {});
  };

  sendMessage = (payload: CreateMessageDataType) => {
    return this.post(`/chat/messages`, payload);
  };

  getToken = (
    payload: string | undefined,
    type: string
  ): Promise<AxiosResponse<ResponseType<SocketCallType>>> => {
    return this.get(`/chat/token/?conversation_id=${payload}&type=${type}`);
  };

  deleteConversation = (payload: string): Promise<AxiosResponse<ResponseType<ConversationType>>> => {
    return this.delete(`/chat/conversations/${payload}`);
  };

  leaveGroup = (payload: string): Promise<AxiosResponse<ResponseType<ConversationType>>> => {
    return this.put(`/chat/conversations/${payload}/leave`);
  };
}

export const messageService = new MessageService();
