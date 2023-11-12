import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  displayOption: false
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    toggleDisplayOption: (state) => {
      return {
        ...state,
        displayOption: !state.displayOption
      };
    }
  }
});

const { reducer, actions } = messageSlice;
export const { toggleDisplayOption } = actions;
export default reducer;
