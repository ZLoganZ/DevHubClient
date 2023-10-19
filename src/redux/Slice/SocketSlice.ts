import { Socket, io } from 'socket.io-client';
import { createSlice } from '@reduxjs/toolkit';

interface State {
  members: string[];
  presenceSocket: Socket;
  chatSocket: Socket;
}

const initialState: State = {
  members: [],
  presenceSocket: io('http://localhost:4056/presence-service'),
  chatSocket: io('http://localhost:4056/chat-service')
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
