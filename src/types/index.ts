export type UserLoginType = {
  email: string;
  password: string;
};

export type GoogleLoginType = {
  token: string;
};

export type UserRegisterType = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  confirm: string;
};

export type UserATokenType = {
  accessToken: string;
};

export type ForgotPasswordType = {
  email: string;
};

export type VerifyCodeType = {
  email: string;
  code: string;
};

export type ResetPasswordType = {
  email: string;
  password: string;
  confirm?: string;
};

export type UpdateUserType = {
  firstname?: string;
  lastname?: string;
  phone_number?: string;
  user_image?: string;
  cover_image?: string;
  tags?: string[];
  alias?: string;
  about?: string;
  experiences?: string[];
  repositories?: string[];
  contacts?: string[];
  location?: string;
};

export type RepositoryType = {
  id: string;
  name: string;
  private: boolean;
  url: string;
  watchersCount: number;
  forksCount: number;
  stargazersCount: number;
  languages: string;
};

export type ExperienceType = {
  id?: string;
  position_name?: string;
  company_name?: string;
  start_date?: string;
  end_date?: string;
};

export type ContactType = {
  key: string;
  tooltip: string;
  link: string;
};

export type UserInfoType = {
  id: string;
  email: string;
  role: string[];
  firstname: string;
  lastname: string;
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
  created_at: string;
  favorites: string[];
  communities: string[];
  notifications: string[];
  followers: UserInfoType[];
  following: UserInfoType[];
  is_following: boolean;
};

export type FollowType = {
  user: UserInfoType;
  follower: UserInfoType[];
  following: UserInfoType[];
};

type TypeofPost = 'Post' | 'Share';

export type PostType = {
  id: string;
  type: TypeofPost;
  post_attributes: {
    user: UserInfoType;
    title?: string;
    content?: string;
    img?: string;
    url?: string;

    post?: PostType;
    owner_post?: UserInfoType;

    view_number: number;
    like_number: number;
    comment_number: number;
    share_number: number;
  };
};

export type LikeType = {
  id: string;
  user: UserInfoType;
  post: PostType;
  owner_post: UserInfoType;
};

type TypeofComment = 'parent' | 'child';

export type CommentType = {
  id: string;
  post: PostType;
  user: UserInfoType;
  content: string;
  type: TypeofComment;

  //if type is child
  parent?: CommentType;

  likes: LikeType[];
  numlike: number;
};
