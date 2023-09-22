import { PostType, UserInfoType } from '@/types';

export const ApplyUserDefaults = (obj: UserInfoType | Object) => {
  if (!obj) return;
  const defaultValues: UserInfoType = {
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
  };

  return { ...defaultValues, ...obj };
};

export const ApplyPostDefaults = (obj: PostType) => {
  if (!obj) return;
  const defaultValues: PostType = {
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
  };

  return { ...defaultValues, ...obj };
};

export const ApplyPostsDefaults = (obj: PostType[]) => {
  if (!obj) return;
  const defaultValues: PostType[] = [
    {
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
    }
  ];

  return obj.map((item) => ({ ...defaultValues[0], ...item }));
};
