import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  handleCommentInput: (_: string) => {}
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setHandleInput: (state, action) => {
      return {
        ...state,
        handleCommentInput: action.payload
      };
    }
  }
});

export const { setHandleInput } = commentSlice.actions;
export default commentSlice.reducer;
