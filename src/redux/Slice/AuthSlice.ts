import { createSlice } from '@reduxjs/toolkit';

import { userService } from '@/services/UserService';
import { AUTHORIZATION } from '@/util/constants/SettingSystem';

const getUserID = async () => {
  try {
    const pathname = window.location.pathname;
    if (
      (pathname === '/login' && !localStorage.getItem(AUTHORIZATION)) ||
      (pathname === '/register' && !localStorage.getItem(AUTHORIZATION))
    )
      return 'Méo có UserID!';

    const { data } = await userService.getUserInfo();

    return data.metadata._id;
  } catch (error: any) {
    console.log(error);
    if (error.response.status === 500) localStorage.removeItem(AUTHORIZATION);
    return 'Méo có UserID!';
  }
};

const initialState = {
  userID: await getUserID(),
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserID: (state, action) => {
      return { ...state, userID: action.payload };
    },
    setLoading: (state, action) => {
      return { ...state, loading: action.payload };
    }
  }
});

export const { setUserID, setLoading } = authSlice.actions;
export default authSlice.reducer;
