import { createSlice } from '@reduxjs/toolkit';

import { userService } from '@/services/UserService';
import { AUTHORIZATION } from '@/util/constants/SettingSystem';

const getUserID = async () => {
  try {
    if (!localStorage.getItem(AUTHORIZATION))
      return 'Méo có UserID!';

    const { data } = await userService.getUserInfo();

    return data.metadata._id;
  } catch (error: any) {
    if (error.response.status === 500) localStorage.removeItem(AUTHORIZATION);
    return 'Méo có UserID!';
  }
};

const initialState = {
  userID: await getUserID(),
  loading: false,
  countErrorLogin: 0,
  errorLogin: '',
  countErrorRegister: 0,
  errorRegister: ''
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
    },
    setErrorLogin: (state, action) => {
      return { ...state, errorLogin: action.payload, countErrorLogin: state.countErrorLogin + 1 };
    },
    setErrorRegister: (state, action) => {
      return { ...state, errorRegister: action.payload, countErrorRegister: state.countErrorRegister + 1 };
    }
  }
});

export const { setUserID, setLoading, setErrorLogin,setErrorRegister } = authSlice.actions;
export default authSlice.reducer;
