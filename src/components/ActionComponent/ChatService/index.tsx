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

import { useAppSelector } from '@/hooks/special';
import { useEffect } from 'react';

const ChatService = () => {
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  useEffect(() => {
    try {
      chatSocket.on('connect', () => {
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
