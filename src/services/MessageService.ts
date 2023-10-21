import { AxiosResponse } from 'axios';
import { BaseService } from './BaseService';
import { ConversationType, CreateMessageDataType, MessageType, ResponseType } from '@/types';

export class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = (): Promise<AxiosResponse<ResponseType<ConversationType[]>>> => {
    return this.get(`/chat/conversations`);
  };

  createConversation = (payload: any) => {
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
}

export const messageService = new MessageService();
