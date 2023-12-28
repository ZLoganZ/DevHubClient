import { IPost, IUserInfo } from '@/types';

const ApplyDefaults = <T extends IUserInfo | IPost | IPost[]>(obj: T): T => {
  const defaultValues: IUserInfo | IPost = {
    _id: '',
    id_incr: 0,
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
    members: [],
    favorites: [],
    communities: [],
    notifications: [],
    friends: [],
    requestSent: [],
    requestReceived: [],
    is_friend: false,
    role: [],
    name: '',
    friend_number: 0,
    pendingFriend_number: 0,
    post_number: 0,
    type: 'Post',
    visibility: 'public',
    post_attributes: {
      user: {
        _id: '',
        id_incr: 0,
        email: '',
        role: [],
        phone_number: '',
        user_image: '',
        cover_image: '',
        last_online: '',
        members: [],
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
        friends: [],
        requestSent: [],
        requestReceived: [],
        is_friend: false,
        name: '',
        friend_number: 0,
        pendingFriend_number: 0,
        post_number: 0
      },
      title: '',
      content: '',
      images: [],
      url: undefined,
      post: undefined,
      owner_post: undefined,
      likes: [],
      comments: [],
      shares: [],
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
