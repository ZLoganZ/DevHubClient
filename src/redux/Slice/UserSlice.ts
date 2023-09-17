import { createSlice } from '@reduxjs/toolkit';

import { RepositoryType, UserInfoType } from '@/types';

interface UserInfoState {
  username: string;
  password: string;
  userInfo: UserInfoType;
  repos: RepositoryType[];
}

const initialState: UserInfoState = {
  username: '',
  password: '',
  userInfo: {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
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
    created_at: '',
    favorites: [],
    communities: [],
    notifications: [],
    followers: [],
    following: [],
    is_following: false,
    role: []
  },
  repos: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password
      };
    },
    setUser: (state, action) => {
      return {
        ...state,
        userInfo: action.payload.userInfo
      };
    },
    setRepos: (state, action) => {
      return {
        ...state,
        repos: action.payload.repository
      };
    }
  }
});

export const { loginUser, setUser, setRepos } = userSlice.actions;
export default userSlice.reducer;
