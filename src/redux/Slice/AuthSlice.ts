import { createSlice } from '@reduxjs/toolkit';

import { userService } from '@/services/UserService';

const getUserID = async () => {
  try {
    const { data } = await userService.getUserInfo();

    return data.metadata._id;
  } catch (error) {
    console.log(error);
    window.location.replace('/login');
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
