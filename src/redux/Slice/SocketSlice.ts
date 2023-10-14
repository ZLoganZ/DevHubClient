import { createSlice } from '@reduxjs/toolkit';

import { UserLoginDataType } from '@/types';
import { Socket, io } from 'socket.io-client';

interface State {
  members: string[];
  followers: UserLoginDataType[];
  presenceSocket: Socket;
  chatSocket: Socket;
}

const initialState: State = {
  members: [],
  followers: [],
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
    },
    addMember: (state, action) => {
      return {
        ...state,
        members: [...state.members, action.payload]
      };
    },
    removeMember: (state, action) => {
      return {
        ...state,
        members: state.members.filter((memberId: any) => memberId !== action.payload)
      };
    },
    setFollowers: (state, action) => {
      return {
        ...state,
        followers: action.payload.followers
      };
    }
  }
});

export const { setMembers, addMember, removeMember, setFollowers } = socketIO.actions;
export default socketIO.reducer;
