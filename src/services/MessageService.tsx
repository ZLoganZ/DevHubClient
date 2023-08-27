import { BaseService } from "./BaseService";

export class MessageService extends BaseService {
  constructor() {
    super();
  }

  getConversations = () => {
    return this.get(`/conversations`);
  };

  createConversation = (payload: unknown) => {
    return this.post(`/conversations`, payload);
  };

  getConversation = (payload: unknown) => {
    return this.get(`/conversations/${payload}`);
  };

  getMessages = (payload: unknown) => {
    return this.get(`/${payload}/messages/`);
  };

  seenMessage = (payload: unknown) => {
    return this.post(`/conversations/${payload}/seen`, null);
  };

  sendMessage = (payload: unknown) => {
    return this.post(`/messages`, payload);
  };
}

export const messageService = new MessageService();
