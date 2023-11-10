import { AxiosResponse } from 'axios';
import { BaseService } from './BaseService';
import {
  ICalled,
  IConversation,
  ICreateConversation,
  ICreateMessage,
  IMessage,
  IResponse,
  ISocketCall
} from '@/types';

class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = (): Promise<AxiosResponse<IResponse<IConversation[]>>> => {
    return this.get(`/chat/conversations`);
  };

  createConversation = (payload: ICreateConversation): Promise<AxiosResponse<IResponse<IConversation>>> => {
    return this.post(`/chat/conversations/create`, payload);
  };

  getConversation = (payload: string): Promise<AxiosResponse<IResponse<IConversation>>> => {
    return this.get(`/chat/conversations/find/${payload}`);
  };

  getCalled = (): Promise<AxiosResponse<IResponse<ICalled[]>>> => {
    return this.get(`/chat/conversations/called`);
  };

  getMessages = (
    payload: string,
    page: number,
    extend?: number
  ): Promise<AxiosResponse<IResponse<IMessage[]>>> => {
    return this.get(`/chat/conversations/${payload}/messages?page=${page}&extend=${extend}`);
  };

  seenMessage = (payload: string) => {
    return this.post(`/chat/conversations/${payload}/seen`, {});
  };

  sendMessage = (payload: ICreateMessage) => {
    return this.post(`/chat/messages`, payload);
  };

  getToken = (payload: string | undefined, type: string): Promise<AxiosResponse<IResponse<ISocketCall>>> => {
    return this.get(`/chat/token/?conversation_id=${payload}&type=${type}`);
  };

  deleteConversation = (payload: string): Promise<AxiosResponse<IResponse<IConversation>>> => {
    return this.delete(`/chat/conversations/${payload}`);
  };

  leaveGroup = (payload: string): Promise<AxiosResponse<IResponse<IConversation>>> => {
    return this.put(`/chat/conversations/${payload}/leave`);
  };
}

export const messageService = new MessageService();
