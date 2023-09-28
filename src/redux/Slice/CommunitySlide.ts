import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  community: null
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunity: (state, action) => {
      return {
        ...state,
        community: action.payload.community
      };
    }
  }
});

export const { setCommunity } = communitySlice.actions;
export default communitySlice.reducer;
