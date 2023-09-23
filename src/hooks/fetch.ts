import { useQuery } from '@tanstack/react-query';

import { userService } from '@/services/UserService';
import {
  ApplyPostsDefaults,
  ApplyUserDefaults
} from '@/util/functions/ApplyDefaults';
import { postService } from '@/services/PostService';
import { TOKEN_GITHUB } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import { useAppSelector } from './special';

// ---------------------------FETCH HOOKS---------------------------

/**
 * The `useUserInfo` function is a custom hook that fetches user information and returns the loading
 * state, error state, user info data, and fetching state.
 * @returns The `useUserInfo` function returns an object with the following properties:
 * - `isLoadingUserInfo` is a boolean that indicates whether the data is still loading.
 * - `isErrorUserInfo` is a boolean that indicates whether there is an error.
 * - `userInfo` is an object that contains information about the user.
 * - `isFetchingUserInfo` is a boolean that indicates whether the query is currently fetching.
 */
export const useUserInfo = () => {
  const userID =
    useAppSelector((state) => state.authReducer.userID) ||
    localStorage.getItem('x-client-id');

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      let [{ data: Followers }, { data: Following }, { data: userInfo }] =
        await Promise.all([
          userService.getFollowers(userID!),
          userService.getFollowing(userID!),
          userService.getUserInfoByID(userID!)
        ]);

      userInfo.metadata.followers = Followers.metadata;
      userInfo.metadata.following = Following.metadata;
      return ApplyUserDefaults(userInfo.metadata);
    },
    staleTime: Infinity
  });

  return {
    isLoadingUserInfo: isLoading,
    isErrorUserInfo: isError,
    userInfo: data!,
    isFetchingUserInfo: isFetching
  };
};

/**
 * The `useOtherUserInfo` function is a custom hook that fetches and returns information about a user
 * other than the current user.
 * @param {string} userID - The `userID` parameter is a string that represents the unique identifier of
 * the user whose information we want to fetch.
 * @returns The function `useOtherUserInfo` returns an object with the following properties:
 * - `isLoadingOtherUserInfo` is a boolean that indicates whether the data is still loading.
 * - `isErrorOtherUserInfo` is a boolean that indicates whether there is an error.
 * - `otherUserInfo` is an object that contains information about the other user.
 * - `isFetchingOtherUserInfo` is a boolean that indicates whether the query is currently fetching.
 */
export const useOtherUserInfo = (userID: string) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['otherUserInfo', userID],
    queryFn: async () => {
      let [{ data: Followers }, { data: Following }, { data: userInfo }] =
        await Promise.all([
          userService.getFollowers(userID),
          userService.getFollowing(userID),
          userService.getUserInfoByID(userID)
        ]);

      userInfo.metadata.followers = Followers.metadata;
      userInfo.metadata.following = Following.metadata;
      return ApplyUserDefaults(userInfo.metadata);
    },
    staleTime: Infinity
  });

  return {
    isLoadingOtherUserInfo: isLoading,
    isErrorOtherUserInfo: isError,
    otherUserInfo: data!,
    isFetchingOtherUserInfo: isFetching
  };
};

/**
 * The `useAllPostsData` function is a custom hook that fetches all posts data, sets the loading and
 * error states, and returns the fetched data along with additional information.
 * @returns The function `useAllPostsData` returns an object with the following properties:
 * - `isLoadingAllPosts` is a boolean that indicates whether the data is still loading.
 * - `isErrorAllPosts` is a boolean that indicates whether there is an error.
 * - `allPosts` is an array of all posts.
 * - `isFetchingAllPosts` is a boolean that indicates whether the query is currently fetching.
 * - `refetchAllPosts` is a function that refetches the posts data.
 */
export const useAllPostsData = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      const { data } = await postService.getAllPost();
      return data;
    },
    staleTime: Infinity,
    onError(err) {
      console.log(err);
    }
  });

  return {
    isLoadingAllPosts: isLoading,
    isErrorAllPosts: isError,
    allPosts: data?.metadata,
    isFetchingAllPosts: isFetching,
    refetchAllPosts: refetch
  };
};

/**
 * The function `useAllPostsNewsfeedData` is a custom hook that fetches all posts for a newsfeed and
 * provides loading, error, data, and refetching functionality.
 * @returns The function `useAllPostsNewsfeedData` returns an object with the following properties:
 * - `isLoadingAllPostsNewsfeed` is a boolean that indicates whether the data is still loading.
 * - `isErrorAllPostsNewsfeed` is a boolean that indicates whether there is an error.
 * - `allPostsNewsfeed` is an array of all posts for a newsfeed.
 * - `isFetchingAllPostsNewsfeed` is a boolean that indicates whether the query is currently fetching.
 * - `refetchAllPostsNewsfeed` is a function that refetches the posts data.
 */
export const useAllPostsNewsfeedData = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['allPostsNewsfeed'],
    queryFn: async () => {
      const { data } = await postService.GetAllPostNewsFeed();
      return ApplyPostsDefaults(data.metadata);
    },
    staleTime: Infinity,
    onError(err) {
      console.log(err);
    }
  });

  return {
    isLoadingAllPostsNewsfeed: isLoading,
    isErrorAllPostsNewsfeed: isError,
    allPostsNewsfeed: data!,
    isFetchingAllPostsNewsfeed: isFetching,
    refetchAllPostsNewsfeed: refetch
  };
};

/**
 * The `useUserPostsData` function is a custom hook that fetches and returns data related to posts, user
 * information, and ownerInfo information based on a given userID.
 * @param {string} userID - The userID parameter is a string that represents the user ID for which the
 * posts data is being fetched.
 * @returns The function `useUserPostsData` returns an object with the following properties:
 * - `isLoadingUserPosts` is a boolean that indicates whether the data is still loading.
 * - `isErrorUserPosts` is a boolean that indicates whether there is an error.
 * - `userPosts` is an array of posts.
 * - `isFetchingUserPosts` is a boolean that indicates whether the query is currently fetching.
 */
export const useUserPostsData = (userID: string) => {
  const client_id = useAppSelector((state) => state.authReducer.userID);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['posts', userID],
    queryFn: async () => {
      const { data } = await postService.getAllPostByUserID(
        userID === 'me' ? client_id! : userID
      );
      return ApplyPostsDefaults(data.metadata);
    },
    enabled: !!userID,
    staleTime: Infinity,
    onError(err) {
      console.log(err);
    }
  });

  return {
    isLoadingUserPosts: isLoading,
    isErrorUserPosts: isError,
    userPosts: data!,
    isFetchingUserPosts: isFetching
  };
};

/**
 * The `usePostData` function is a custom hook that fetches a post by its ID and returns the post data,
 * loading state, error state, and fetching state.
 * @param {string} postID - The postID parameter is a string that represents the ID of the post you
 * want to fetch.
 * @returns The function `usePostData` returns an object with the following properties:
 * - `isLoadingPost` is a boolean that indicates whether the post data is still loading.
 * - `isErrorPost` is a boolean that indicates whether there is an error.
 * - `post` is an object that contains information about the post.
 * - `isFetchingPost` is a boolean that indicates whether the query is currently fetching.
 */
export const usePostData = (postID: string) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['post', postID],
    queryFn: async () => {
      const { data } = await postService.getPostByID(postID);
      return data;
    },
    staleTime: Infinity
  });

  return {
    isLoadingPost: isLoading,
    isErrorPost: isError,
    post: data?.metadata,
    isFetchingPost: isFetching
  };
};

/**
 * The `useCommentsData` function is a custom hook that fetches and returns comments data for a
 * specific post ID.
 * @param {string} postID - The postID parameter is a string that represents the ID of a post. It is
 * used to fetch the comments associated with that post.
 * @returns The function `useCommentsData` returns an object with the following properties:
 * - `isLoadingComments` is a boolean that indicates whether the comments data is still loading.
 * - `isErrorComments` is a boolean that indicates whether there is an error.
 * - `comments` is an array of comments.
 * - `isFetchingComments` is a boolean that indicates whether the query is currently fetching.
 */
export const useCommentsData = (postID: string) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['comments', postID],
    queryFn: async () => {
      const { data } = await postService.getParentComments(postID);
      return data;
    },
    enabled: !!postID,
    staleTime: Infinity
  });

  return {
    isLoadingComments: isLoading,
    isErrorComments: isError,
    comments: data?.metadata,
    isFetchingComments: isFetching
  };
};

/**
 * The `useGetRepository` function is a custom hook that retrieves repository data from GitHub API and
 * provides loading, error, and fetching status.
 * @returns The function `useGetRepository` returns an object with the following properties:
 * - `isLoadingRepository` is a boolean that indicates whether the repository data is still loading.
 * - `isErrorRepository` is a boolean that indicates whether there is an error.
 * - `repository` is an object that contains information about the repository.
 * - `isFetchingRepository` is a boolean that indicates whether the query is currently fetching.
 */
export const useGetRepository = () => {
  const aGToken = localStorage.getItem(TOKEN_GITHUB);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['repository'],
    queryFn: async () => {
      const { data } = await userService.getRepositoryGithub();
      return data;
    },
    staleTime: Infinity,
    enabled: !!aGToken
  });

  return {
    isLoadingRepository: isLoading,
    isErrorRepository: isError,
    repository: data?.metadata,
    isFetchingRepository: isFetching
  };
};

/**
 * The `useConversationsData` function is a custom hook that fetches conversations data and returns
 * loading, error, and data states.
 * @returns The function `useConversationsData` returns an object with the following properties:
 * - `isLoadingConversations` is a boolean that indicates whether the conversations data is still
 * loading.
 * - `isErrorConversations` is a boolean that indicates whether there is an error.
 * - `conversations` is an array of conversations.
 * - `isFetchingConversations` is a boolean that indicates whether the query is currently fetching.
 */
export const useConversationsData = () => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await messageService.getConversations();
      return data;
    }
  });

  return {
    isLoadingConversations: isLoading,
    isErrorConversations: isError,
    conversations: data?.content?.conversations,
    isFetchingConversations: isFetching
  };
};

/**
 * The function `useCurrentConversationData` is a custom hook that retrieves and returns the current
 * conversation data based on the provided conversation ID.
 * @param {string | undefined} conversationID - The conversationID parameter is a string that
 * represents the ID of the conversation for which we want to fetch data.
 * @returns The function `useCurrentConversationData` returns an object with the following properties:
 * - `isLoadingCurrentConversation` is a boolean that indicates whether the conversation data is still
 * loading.
 * - `isErrorCurrentConversation` is a boolean that indicates whether there is an error.
 * - `currentConversation` is an object that contains information about the current conversation.
 * - `isFetchingCurrentConversation` is a boolean that indicates whether the query is currently fetching.
 */
export const useCurrentConversationData = (
  conversationID: string | undefined
) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['conversation', conversationID],
    queryFn: async () => {
      const { data } = await messageService.getConversation(conversationID);
      return data;
    },
    enabled: !!conversationID
  });

  return {
    isLoadingCurrentConversation: isLoading,
    isErrorCurrentConversation: isError,
    currentConversation: data?.content?.conversation,
    isFetchingCurrentConversation: isFetching
  };
};

/**
 * The `useFollowersData` function is a custom hook that fetches and returns data about a user's
 * followers, including loading and error states.
 * @param {string} userID - The `userID` parameter is a string that represents the ID of the user for
 * whom we want to fetch the followers data.
 * @returns The function `useFollowersData` returns an object with the following properties:
 * - `isLoadingFollowers` is a boolean that indicates whether the followers data is still loading.
 * - `isErrorFollowers` is a boolean that indicates whether there is an error.
 * - `followers` is an array of followers.
 * - `isFetchingFollowers` is a boolean that indicates whether the query is currently fetching.
 */
export const useFollowersData = (userID: string) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['followers', userID],
    queryFn: async () => {
      const { data } = await userService.getFollowers(userID);
      return data;
    },
    enabled: !!userID
  });

  return {
    isLoadingFollowers: isLoading,
    isErrorFollowers: isError,
    followers: data?.metadata,
    isFetchingFollowers: isFetching
  };
};

/**
 * The `useMessagesData` function is a custom hook that fetches messages data for a given conversation
 * ID and provides loading, error, data, and refetching functionality.
 * @param {any} conversationID - The conversationID parameter is the unique identifier for a
 * conversation. It is used to fetch the messages associated with that conversation.
 * @returns The function `useMessagesData` returns an object with the following properties:
 * - `isLoadingMessages` is a boolean that indicates whether the messages data is still loading.
 * - `isErrorMessages` is a boolean that indicates whether there is an error.
 * - `messages` is an array of messages.
 * - `isFetchingMessages` is a boolean that indicates whether the query is currently fetching.
 * - `refetchMessages` is a function that refetches the messages data.
 */
export const useMessagesData = (conversationID: any) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['messages', conversationID],
    queryFn: async () => {
      const { data } = await messageService.getMessages(conversationID);
      return data;
    },
    enabled: !!conversationID
  });

  return {
    isLoadingMessages: isLoading,
    isErrorMessages: isError,
    messages: data?.content?.messages,
    isFetchingMessages: isFetching,
    refetchMessages: refetch
  };
};
