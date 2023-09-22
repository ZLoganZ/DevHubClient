import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  login: null,
  userID: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      return { ...state, login: action.payload };
    },
    setUserID: (state, action) => {
      return { ...state, userID: action.payload };
    }
  }
});

export const { setLogin, setUserID } = authSlice.actions;
export default authSlice.reducer;
