import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  arrayShouldFriends: []
};

const getStartedSlice = createSlice({
  name: 'GetStarted',
  initialState,
  reducers: {
    setShouldFriends: (state, action) => {
      return { ...state, arrayShouldFriends: action.payload.users };
    }
  }
});

export const { setShouldFriends: setShouldFriends } = getStartedSlice.actions;
export default getStartedSlice.reducer;
