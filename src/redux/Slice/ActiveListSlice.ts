import { createSlice } from '@reduxjs/toolkit';

import { UserLoginType } from '@/types';

interface State {
  members: string[];
  followers: UserLoginType[];
}

const initialState: State = {
  members: [],
  followers: []
};

const activeListSlice = createSlice({
  name: 'activeList',
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
        members: state.members.filter(
          (memberId: any) => memberId !== action.payload
        )
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

export const { setMembers, addMember, removeMember, setFollowers } =
  activeListSlice.actions;
export default activeListSlice.reducer;
