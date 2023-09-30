import { PostType, UserInfoType } from '@/types';

const ApplyDefaults = <T extends UserInfoType | PostType | PostType[]>(obj: T): T => {
  const defaultValues: UserInfoType | PostType = {
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
    is_followed: false,
    role: [],
    name: '',
    follower_number: 0,
    following_number: 0,
    post_number: 0,
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
        is_followed: false,
        name: '',
        follower_number: 0,
        following_number: 0,
        post_number: 0
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
    is_liked: false,
    is_shared: false,
    is_saved: false
  };

  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => ({ ...defaultValues, ...item })) as T;
  }

  return { ...defaultValues, ...obj } as T;
};

export default ApplyDefaults;
