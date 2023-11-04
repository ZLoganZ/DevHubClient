export interface UserLoginDataType {
  email: string;
  password: string;
}

export interface GoogleLoginDataType {
  token: string;
}

export interface UserRegisterDataType {
  email: string;
  password: string;
  name: string;
  confirm: string;
}

export interface UserATokenType {
  accessToken: string;
}

export interface ForgotPasswordDataType {
  email: string;
}

export interface VerifyCodeDataType {
  email: string;
  code: string;
}

export interface ResetPasswordDataType {
  email: string;
  password: string;
  confirm?: string;
}

export interface UserUpdateDataType {
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
}

export interface RepositoryType {
  id: string;
  name: string;
  private: boolean;
  html_url: string;
  watchers_count: number;
  forks_count: number;
  stargazers_count: number;
  languages: string;
}

export interface ExperienceType {
  position_name: string;
  company_name: string;
  start_date: string;
  end_date: string;
}

export interface ContactType {
  key: string;
  tooltip: string;
  link: string;
  state?: boolean;
}

export interface UserInfoType {
  _id: string;
  name: string;
  email: string;
  role: string[];
  last_online: string;
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
}

type TypeofPost = 'Post' | 'Share';

export interface TypeOfLink {
  address: string;
  title: string;
  description: string;
  image: string;
}

export interface CreatePostDataType {
  title: string;
  content: string;
  image?: string;
}

export interface UpdatePostDataType {
  id: string;
  postUpdate: CreatePostDataType;
}

export interface SharePostDataType {
  post: string;
  owner_post: string;
}

export interface PostType {
  _id: string;
  type: TypeofPost;
  post_attributes: {
    user: UserInfoType;

    //if type is post
    title?: string;
    content?: string;
    images?: string[];
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
}

export interface LikeType {
  _id: string;
  user: UserInfoType;
  post: PostType;
  owner_post: UserInfoType;
}

type TypeofComment = 'parent' | 'child';

export interface CreateCommentDataType {
  content: string;
  type: TypeofComment;
  post: string;
  parent?: string;
}

export interface CreateLikeCommentType {
  id: string;
  comment: LikeCommentType;
}

export interface GetChildCommentsType {
  post: string;
  parent: string;
}

export interface LikeCommentType {
  type: TypeofComment;
  post: string;
  owner_comment: string;
}

export interface CommentType {
  _id: string;
  post: PostType;
  user: UserInfoType;
  content: string;
  type: TypeofComment;

  //if interface is child
  parent?: CommentType;

  //if interface is parent
  children?: CommentType[];

  is_liked: boolean;
  is_disliked: boolean;
  likes: LikeType[];
  dislikes: LikeType[];
  like_number: number;
  dislike_number: number;
  createdAt: string;
}

export interface SelectedCommentValues {
  isReply: boolean;
  idComment: string | null;
  name: string | null;
  user_image: string | null;
}

export interface ResponseType<T> {
  message: string;
  status: number;
  metadata: T;
}

export type TypeofConversation = 'private' | 'group';

export interface ConversationType {
  _id: string;
  type: TypeofConversation;
  members: UserInfoType[];
  name: string;
  lastMessage: MessageType;
  seen: UserInfoType[];
  admins?: UserInfoType[];
  image?: string;
  cover_image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDataType {
  type: TypeofConversation;
  members: string[];
  name?: string;
  image?: string;
}

type TypeofMessage = 'text' | 'notification' | 'audio' | 'file' | 'voice' | 'video';

export interface MessageType {
  _id: string;
  conversation_id: string;
  type: TypeofMessage;
  sender: UserInfoType;
  content: string;
  isSending?: boolean;
  image?: string;
  createdAt: string;
}

export interface CreateMessageDataType {
  conversation_id: string;
  content?: string;
  image?: string;
}

export interface CalledType {
  _id: string;
  content: string;
  conversation_id: ConversationType;
  sender: UserInfoType;
  type: TypeofMessage;
  createdAt: string;
}

export interface ImageResponse {
  key: string;
}
export interface EmojisType {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}


export interface SocketCallType {
  name: string;
  user_image: string;
  members: string[];
  token: string;
  first_call: boolean;
}
