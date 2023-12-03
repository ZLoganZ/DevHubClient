import { Socket, io } from 'socket.io-client';
import { createSlice } from '@reduxjs/toolkit';
import { IUserInfo } from '@/types';

interface member {
  _id: string;
  last_online: string;
  first_online: boolean;
  is_online: boolean;
}
interface State {
  activeMembers: member[];
  members: IUserInfo[];
  presenceSocket: Socket;
  chatSocket: Socket;
}

const initialState: State = {
  activeMembers: [],
  members: [],
  presenceSocket: io(`${import.meta.env.VITE_CHAT_SERVER}/presence-service`, { transports: ['websocket'] }),
  chatSocket: io(`${import.meta.env.VITE_CHAT_SERVER}/chat-service`, { transports: ['websocket'] })
};

const socketIO = createSlice({
  name: 'socketIO',
  initialState,
  reducers: {
    setActiveMembers: (state, action) => {
      return {
        ...state,
        activeMembers: action.payload
      };
    },
    setMembers: (state, action) => {
      return {
        ...state,
        members: action.payload
      };
    }
  }
});

export const { setActiveMembers, setMembers } = socketIO.actions;
export default socketIO.reducer;
