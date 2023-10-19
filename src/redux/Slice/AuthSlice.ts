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
    setUserID: (state, action) => {
      return { ...state, userID: action.payload };
    }
  }
});

export const { setUserID } = authSlice.actions;
export default authSlice.reducer;
