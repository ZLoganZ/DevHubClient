import { createSlice } from '@reduxjs/toolkit';

import { PostType, UserInfoType } from '@/types';

interface State {
  postArr: PostType[];
  allPost: PostType[];
  post: PostType;
  ownerInfo: UserInfoType;
  isOpenPostDetail: boolean;
  isInProfile: boolean;
}

const initialState: State = {
  postArr: [],
  allPost: [],
  post: {
    type: 'Post',
    id: '',
    post_attributes: {
      user: {
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
        is_following: false
      },
      title: undefined,
      content: undefined,
      img: undefined,
      url: undefined,
      post: undefined,
      owner_post: undefined,
      view_number: 0,
      like_number: 0,
      comment_number: 0,
      share_number: 0
    }
  },
  ownerInfo: {
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
    is_following: false
  },

  isOpenPostDetail: false,
  isInProfile: false
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setAllPost: (state, action) => {
      return {
        ...state,
        allPost: action.payload.allPostArr
      };
    },
    setPostArr: (state, action) => {
      return {
        ...state,
        postArr: action.payload.postArr
      };
    },
    openPostDetail: (state) => {
      return {
        ...state,
        isOpenPostDetail: true
      };
    },
    setPost: (state, action) => {
      return {
        ...state,
        post: action.payload.post
      };
    },
    setOwnerInfo: (state, action) => {
      return {
        ...state,
        ownerInfo: action.payload.ownerInfo
      };
    },
    setIsInProfile: (state, action) => {
      return {
        ...state,
        isInProfile: action.payload
      };
    },
    updatePosts: (state, action) => {
      const updatedPosts = state.postArr.map((post: any) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        }
        return post;
      });
      return {
        ...state,
        postArr: updatedPosts
      };
    }
  }
});

export const {
  setAllPost,
  openPostDetail,
  setPost,
  setOwnerInfo,
  setIsInProfile,
  updatePosts,
  setPostArr
} = postSlice.actions;
export default postSlice.reducer;
