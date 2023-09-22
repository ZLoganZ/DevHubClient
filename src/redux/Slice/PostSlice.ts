import { createSlice } from '@reduxjs/toolkit';

import { PostType, UserInfoType } from '@/types';

interface State {
  postArr: PostType[];
  allPosts: PostType[];
  allPostsNewsfeed: PostType[];
  post: PostType;
  ownerInfo: UserInfoType;
  isOpenPostDetail: boolean;
  isInProfile: boolean;
}

const initialState: State = {
  postArr: [],
  allPosts: [],
  post: {
    _id: '',
    type: 'Post',
    post_attributes: {
      user: {
        _id: '',
        email: '',
        role: [],
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
        name: ''
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
    },
    createdAt: '',
    is_liked: false,
    is_shared: false,
    is_saved: false
  },
  ownerInfo: {
    name: '',
    _id: '',
    email: '',
    role: [],
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
    is_following: false
  },
  isOpenPostDetail: false,
  isInProfile: false,
  allPostsNewsfeed: []
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setAllPost: (state, action) => {
      return {
        ...state,
        allPosts: action.payload
      };
    },
    setAllPostNewsfeed: (state, action) => {
      return {
        ...state,
        allPostsNewsfeed: action.payload
      };
    },
    setPostArr: (state, action) => {
      return {
        ...state,
        postArr: action.payload
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
        post: action.payload
      };
    },
    setOwnerInfo: (state, action) => {
      return {
        ...state,
        ownerInfo: action.payload
      };
    },
    setIsInProfile: (state, action) => {
      return {
        ...state,
        isInProfile: action.payload
      };
    },
    updatePosts: (state, action) => {
      const updatedPosts = state.postArr.map((post) => {
        if (post._id === action.payload._id) {
          return action.payload;
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
  setPostArr,
  setAllPostNewsfeed
} = postSlice.actions;
export default postSlice.reducer;
