export type UserLoginDataType = {
  email: string;
  password: string;
};

export type GoogleLoginDataType = {
  token: string;
};

export type UserRegisterDataType = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  confirm: string;
};

export type UserATokenType = {
  accessToken: string;
};

export type ForgotPasswordDataType = {
  email: string;
};

export type VerifyCodeDataType = {
  email: string;
  code: string;
};

export type ResetPasswordDataType = {
  email: string;
  password: string;
  confirm?: string;
};

export type UserUpdateDataType = {
  name?: string;
  phone_number?: string;
  user_image?: string;
  cover_image?: string;
  tags?: string[];
  alias?: string;
  about?: string;
  experiences?: ExperienceType[];
  repositories?: RepositoryType[];
  contacts?: ContactType[];
  location?: string;
};

export type RepositoryType = {
  id: string;
  name: string;
  private: boolean;
  html_url: string;
  watchers_count: number;
  forks_count: number;
  stargazers_count: number;
  languages: string;
};

export type ExperienceType = {
  position_name: string;
  company_name: string;
  start_date: string;
  end_date: string;
};

export type ContactType = {
  key: string;
  tooltip: string;
  link: string;
  state?: boolean;
};

export type UserInfoType = {
  _id: string;
  name: string;
  email: string;
  role: string[];
  phone_number: string;
  user_image: string;
  cover_image: string;
  tags: string[];
  alias: string;
  about: string;
  posts: PostType[];
  experiences: ExperienceType[];
  repositories: RepositoryType[];
  contacts: ContactType[];
  location: string;
  createdAt: string;
  favorites: string[];
  communities: string[];
  notifications: string[];
  followers: UserInfoType[];
  following: UserInfoType[];
  follower_number: number;
  following_number: number;
  members: UserInfoType[];
  post_number: number;
  is_followed: boolean;
};

type TypeofPost = 'Post' | 'Share';

export type TypeOfLink = {
  address: string;
  title: string;
  description: string;
  image: string;
};

export type CreatePostDataType = {
  title: string;
  content: string;
  img?: string;
};

export type UpdatePostDataType = {
  id: string;
  postUpdate: CreatePostDataType;
};

export type SharePostDataType = {
  post: string;
  owner_post: string;
};

export type PostType = {
  _id: string;
  type: TypeofPost;
  post_attributes: {
    user: UserInfoType;

    //if type is post
    title?: string;
    content?: string;
    img?: string;
    url?: TypeOfLink;

    //if type is share
    post?: PostType;
    owner_post?: UserInfoType;

    view_number: number;
    like_number: number;
    comment_number: number;
    share_number: number;
  };
  is_liked: boolean;
  is_shared: boolean;
  is_saved: boolean;
  createdAt: string;
};

export type LikeType = {
  _id: string;
  user: UserInfoType;
  post: PostType;
  owner_post: UserInfoType;
};

type TypeofComment = 'parent' | 'child';

export type CreateCommentDataType = {
  content: string;
  type: TypeofComment;
  post: string;
  parent?: string;
};

export type CreateLikeCommentType = {
  id: string;
  comment: LikeCommentType;
};

export type GetChildCommentsType = {
  post: string;
  parent: string;
};

export type LikeCommentType = {
  type: TypeofComment;
  post: string;
  owner_comment: string;
};

export type CommentType = {
  _id: string;
  post: PostType;
  user: UserInfoType;
  content: string;
  type: TypeofComment;

  //if type is child
  parent?: CommentType;

  //if type is parent
  children?: CommentType[];

  is_liked: boolean;
  is_disliked: boolean;
  likes: LikeType[];
  dislikes: LikeType[];
  like_number: number;
  dislike_number: number;
  createdAt: string;
};

export type SelectedCommentValues = {
  isReply: boolean;
  idComment: string | null;
  name: string | null;
  user_image: string | null;
};

export type ResponseType<T> = {
  message: string;
  status: number;
  metadata: T;
};

type TypeofConversation = 'private' | 'group';

export type ConversationType = {
  _id: string;
  type: TypeofConversation;
  members: UserInfoType[];
  name: string;
  lastMessage: MessageType;
  seen: UserInfoType[];
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateConversationDataType = {
  type: TypeofConversation;
  members: string[];
  name?: string;
  image?: string;
}

export type MessageType = {
  _id: string;
  conversation_id: string;
  sender: UserInfoType;
  content: string;
  isSending?: boolean;
  image?: string;
  createdAt: string;
};

export type CreateMessageDataType = {
  conversation_id: string;
  content?: string;
  image?: string;
};
