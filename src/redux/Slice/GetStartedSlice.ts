import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  arrayShouldFollowers: []
};

const getStartedSlice = createSlice({
  name: 'GetStarted',
  initialState,
  reducers: {
    setShouldFollowers: (state, action) => {
      return { ...state, arrayShouldFollowers: action.payload.users };
    }
  }
});

export const { setShouldFollowers } = getStartedSlice.actions;
export default getStartedSlice.reducer;
