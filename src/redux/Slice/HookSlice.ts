import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  navigate: () => {},
  dispatch: () => {},
  useSelector: () => {},
  location: () => {}
};

const hookSlice = createSlice({
  name: 'hook',
  initialState,
  reducers: {
    setNavigate: (state, action) => {
      return { ...state, navigate: action.payload };
    },
    setDispatch: (state, action) => {
      return { ...state, dispatch: action.payload };
    },
    setUseSelector: (state, action) => {
      return { ...state, useSelector: action.payload };
    },
    setLocation: (state, action) => {
      return { ...state, location: action.payload };
    }
  }
});

export const { setNavigate, setDispatch, setUseSelector, setLocation } = hookSlice.actions;
export default hookSlice.reducer;
