// import { clientChat } from './chat.connect';

// class ChatService {
//   constructor() {
//     this.listen();
//   }
//   async listen() {
//     try {
//       clientChat.on('connect', () => {
//         console.log('connected chatService');
//       });
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
// }

// export default ChatService;

import React, { useEffect } from 'react';
import { clientChat } from './chat.connect';

const ChatService = () => {
  useEffect(() => {
    try {
      clientChat.on('connect', () => {
        console.log('connected chatService');
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  return <></>;
};

export default ChatService;
