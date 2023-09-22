import { createSlice } from '@reduxjs/toolkit';

import { RepositoryType, UserInfoType } from '@/types';

interface UserInfoState {
  name: string;
  password: string;
  userInfo: UserInfoType;
  repos: RepositoryType[];
}

const initialState: UserInfoState = {
  name: '',
  password: '',
  userInfo: {
    _id: '',
    email: '',
    phone_number: '',
    user_image: '',
    cover_image: '',
    tags: [],
    alias: '',
    about: '',
    posts: [],
    experiences: [],
    repositories: [],
    contacts: [],
    location: '',
    createdAt: '',
    favorites: [],
    communities: [],
    notifications: [],
    followers: [],
    following: [],
    is_following: false,
    role: [],
    name: ''
  },
  repos: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload }
      };
    },
    setRepos: (state, action) => {
      return {
        ...state,
        repos: action.payload
      };
    }
  }
});

export const { setUser, setRepos } = userSlice.actions;
export default userSlice.reducer;
