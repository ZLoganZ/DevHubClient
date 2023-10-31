import { Socket, io } from 'socket.io-client';
import { createSlice } from '@reduxjs/toolkit';

interface member {
  _id: string;
  last_online: string;
  first_online: number;
  is_online: boolean;
}
interface State {
  members: member[];
  presenceSocket: Socket;
  chatSocket: Socket;
}

const initialState: State = {
  members: [],
  presenceSocket: io(`${import.meta.env.VITE_CHAT_SERVER}/presence-service`, { transports: ['websocket'] }),
  chatSocket: io(`${import.meta.env.VITE_CHAT_SERVER}/chat-service`, { transports: ['websocket'] })
};

const socketIO = createSlice({
  name: 'socketIO',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      return {
        ...state,
        members: action.payload
      };
    }
  }
});

export const { setMembers } = socketIO.actions;
export default socketIO.reducer;
