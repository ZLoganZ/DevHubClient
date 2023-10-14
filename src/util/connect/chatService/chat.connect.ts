import io from 'socket.io-client';

const host = 'http://localhost:4056';

const chatService = '/chat-service';

export const clientChat = io(`${host}${chatService}`);
