import { createSlice } from '@reduxjs/toolkit';

import { userService } from '@/services/UserService';

const getUserID = async () => {
  try {
    const { data } = await userService.getUserInfo();

    return data.metadata._id;
  } catch (error) {
    return null;
  }
};

const initialState = {
  userID: await getUserID()
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
