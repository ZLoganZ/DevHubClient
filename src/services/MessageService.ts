import { BaseService } from './BaseService';

export class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = () => {
    return this.get(`/chat/conversations`);
  };

  createConversation = (payload: any) => {
    return this.post(`/conversations/create`, payload);
  };

  getConversation = (payload: any) => {
    return this.get(`/conversations/${payload}`);
  };

  getMessages = (payload: any) => {
    return this.get(`/${payload}/messages/`);
  };

  seenMessage = (payload: any) => {
    return this.post(`/conversations/${payload}/seen`);
  };

  sendMessage = (payload: any) => {
    return this.post(`/messages`, payload);
  };
}

export const messageService = new MessageService();
