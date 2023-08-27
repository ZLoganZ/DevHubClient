import { createSlice } from "@reduxjs/toolkit";

interface State {
  members: any[];
  followers: any;
}

const initialState: State = {
  members: [null],
  followers: null,
};

const activeListSlice = createSlice({
  name: "activeList",
  initialState,
  reducers: {
    setMembers: (state, action) => {
      return {
        ...state,
        members: action.payload,
      };
    },
    addMember: (state, action) => {
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    },
    removeMember: (state, action) => {
      return {
        ...state,
        members: state.members.filter(
          (memberId: any) => memberId !== action.payload
        ),
      };
    },
    setFollowers: (state, action) => {
      return {
        ...state,
        followers: action.payload.followers,
      };
    },
  },
});

export const { setMembers, addMember, removeMember, setFollowers } =
  activeListSlice.actions;
export default activeListSlice.reducer;
