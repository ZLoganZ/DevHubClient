import { BaseService } from './BaseService';

export class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = () => {
    return this.get(`/chat/conversations`);
  };

  createConversation = (payload: any) => {
    return this.post(`/chat/conversations/create`, payload);
  };

  getConversation = (payload: any) => {
    return this.get(`/chat/conversations/find/${payload}`);
  };

  getMessages = (payload: any) => {
    return this.get(`/chat/conversations/${payload}/messages`);
  };

  seenMessage = (payload: any) => {
    return this.post(`/chat/conversations/${payload}/seen`, {});
  };

  sendMessage = (payload: any) => {
    return this.post(`/chat/messages`, payload);
  };
}

export const messageService = new MessageService();
