import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  navigate: () => {},
  dispatch: () => {},
  useSelector: () => {},
  location: () => {}
};

const functionSlice = createSlice({
  name: 'function',
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

export const { setNavigate, setDispatch, setUseSelector, setLocation } =
  functionSlice.actions;
export default functionSlice.reducer;
