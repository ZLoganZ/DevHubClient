import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  handleCommentParentInput: (_: string) => {},
  handleCommentChildInput: (_: string) => {}
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setHandleParentInput: (state, action) => {
      return {
        ...state,
        handleCommentParentInput: action.payload
      };
    },
    setHandleChildInput: (state, action) => {
      return {
        ...state,
        handleCommentChildInput: action.payload
      };
    }
  }
});

export const { setHandleParentInput, setHandleChildInput } = commentSlice.actions;
export default commentSlice.reducer;
