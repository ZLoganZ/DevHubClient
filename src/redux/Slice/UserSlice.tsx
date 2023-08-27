import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: 'Admintck1',
  password: 'Admintck1',
  userInfo: null,

  repos: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
      };
    },
    setUser: (state, action) => {
      return {
        ...state,
        userInfo: action.payload.userInfo,
      };
    },
    setRepos: (state, action) => {
      return {
        ...state,
        repos: action.payload.repository,
      };
    },
  },
});

export const { loginUser, setUser, setRepos } = userSlice.actions;
export default userSlice.reducer;
