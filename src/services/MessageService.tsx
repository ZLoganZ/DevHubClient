import { BaseService } from "./BaseService";

export class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = () => {
    return this.get(`/conversations`);
  };

  createConversation = (payload: any) => {
    return this.post(`/conversations`, payload);
  };

  getConversation = (payload: any) => {
    return this.get(`/conversations/${payload}`);
  };

  getMessages = (payload: any) => {
    return this.get(`/${payload}/messages/`);
  };

  seenMessage = (payload: any) => {
    return this.post(`/conversations/${payload}/seen`, null);
  };

  sendMessage = (payload: any) => {
    return this.post(`/messages`, payload);
  };
}

export const messageService = new MessageService();
