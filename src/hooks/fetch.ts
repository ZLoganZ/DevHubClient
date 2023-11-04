import { InfiniteData, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

import { MessageType } from '@/types';
import { userService } from '@/services/UserService';
import ApplyDefaults from '@/util/applyDefaults';
import { postService } from '@/services/PostService';
import { GITHUB_TOKEN } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import { useAppSelector } from './special';

// ---------------------------FETCH HOOKS---------------------------

/**
 * The `useCurrentUserInfo` function is a custom hook that retrieves the current user's information,
 * including their followers and following counts, from an API and returns the loading, error, and data
 * states.
 * @returns The function `useCurrentUserInfo` returns an object with the following properties:
 * - `isLoadingCurrentUserInfo` is a boolean that indicates whether the user data is still loading.
 * - `isErrorCurrentUserInfo` is a boolean that indicates whether there is an error.
 * - `currentUserInfo` is an object that contains information about the current user.
 * - `isFetchingCurrentUserInfo` is a boolean that indicates whether the query is currently fetching.
 */
export const useCurrentUserInfo = () => {
  const userID = useAppSelector((state) => state.auth.userID);

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['currentUserInfo'],
    queryFn: async () => {
      const [{ data: Followers }, { data: Following }, { data: userInfo }] = await Promise.all([
        userService.getFollowers(userID),
        userService.getFollowing(userID),
        userService.getUserInfoByID(userID)
      ]);

      userInfo.metadata.followers = Followers.metadata;
      userInfo.metadata.following = Following.metadata;
      return ApplyDefaults(userInfo.metadata);
    },
    staleTime: Infinity,
    enabled: window.location.pathname !== '/login' && window.location.pathname !== '/register'
  });

  return {
    isLoadingCurrentUserInfo: isPending,
    isErrorCurrentUserInfo: isError,
    currentUserInfo: data!,
    isFetchingCurrentUserInfo: isFetching
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
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['otherUserInfo', userID],
    queryFn: async () => {
      const [{ data: Followers }, { data: Following }, { data: userInfo }] = await Promise.all([
        userService.getFollowers(userID),
        userService.getFollowing(userID),
        userService.getUserInfoByID(userID)
      ]);

      userInfo.metadata.followers = Followers.metadata;
      userInfo.metadata.following = Following.metadata;
      return ApplyDefaults(userInfo.metadata);
    },
    staleTime: Infinity
  });

  return {
    isLoadingOtherUserInfo: isPending,
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
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      const { data } = await postService.getAllPost();
      return data;
    },
    staleTime: Infinity
  });

  return {
    isLoadingAllPosts: isPending,
    isErrorAllPosts: isError,
    allPosts: data?.metadata,
    isFetchingAllPosts: isFetching,
    refetchAllPosts: refetch
  };
};

/**
 * The function `useAllNewsfeedPostsData` is a custom hook that fetches all posts for a newsfeed and
 * provides loading, error, data, and refetching functionality.
 * @returns The function `useAllNewsfeedPostsData` returns an object with the following properties:
 * - `isLoadingAllNewsfeedPosts` is a boolean that indicates whether the data is still loading.
 * - `isErrorAllNewsfeedPosts` is a boolean that indicates whether there is an error.
 * - `allNewsfeedPosts` is an array of all posts for a newsfeed.
 * - `isFetchingAllNewsfeedPosts` is a boolean that indicates whether the query is currently fetching.
 * - `refetchAllNewsfeedPosts` is a function that refetches the posts data.
 */
export const useAllNewsfeedPostsData = () => {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['allNewsfeedPosts'],
    queryFn: async () => {
      const { data } = await postService.getAllPostNewsFeed();
      return ApplyDefaults(data.metadata);
    },
    staleTime: Infinity,
    enabled: window.location.pathname === '/'
  });

  return {
    isLoadingAllNewsfeedPosts: isPending,
    isErrorAllNewsfeedPosts: isError,
    allNewsfeedPosts: data!,
    isFetchingAllNewsfeedPosts: isFetching,
    refetchAllNewsfeedPosts: refetch
  };
};

/**
 * The function `useAllPopularPostsData` is a custom hook that fetches data for all popular posts and
 * returns the loading state, error state, fetched data, and a function to refetch the data.
 * @returns The function `useAllPopularPostsData` returns an object with the following properties:
 * - `isLoadingAllPopularPosts` is a boolean that indicates whether the data is still loading.
 * - `isErrorAllPopularPosts` is a boolean that indicates whether there is an error.
 * - `allPopularPosts` is an array of all popular posts.
 * - `isFetchingAllPopularPosts` is a boolean that indicates whether the query is currently fetching.
 */
export const useAllPopularPostsData = (sort: string) => {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['allPopularPosts', sort],
    queryFn: async () => {
      const { data } = await postService.getAllPopularPost(sort);
      return data;
    },
    staleTime: Infinity,
    enabled: window.location.pathname === '/' && !!sort
  });

  return {
    isLoadingAllPopularPosts: isPending,
    isErrorAllPopularPosts: isError,
    allPopularPosts: data?.metadata,
    isFetchingAllPopularPosts: isFetching,
    refetchAllPopularPosts: refetch
  };
};

/**
 * The `useUserPostsData` function is a custom hook that fetches and returns data related to posts, user
 * information, and postSharer information based on a given userID.
 * @param {string} userID - The userID parameter is a string that represents the user ID for which the
 * posts data is being fetched.
 * @returns The function `useUserPostsData` returns an object with the following properties:
 * - `isLoadingUserPosts` is a boolean that indicates whether the data is still loading.
 * - `isErrorUserPosts` is a boolean that indicates whether there is an error.
 * - `userPosts` is an array of posts.
 * - `isFetchingUserPosts` is a boolean that indicates whether the query is currently fetching.
 */
export const useUserPostsData = (userID: string) => {
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['posts', userID],
    queryFn: async () => {
      const { data } = await postService.getAllPostByUserID(userID);
      return ApplyDefaults(data.metadata);
    },
    staleTime: Infinity
  });

  return {
    isLoadingUserPosts: isPending,
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
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['post', postID],
    queryFn: async () => {
      const { data } = await postService.getPostByID(postID);
      return data;
    },
    staleTime: Infinity
  });

  return {
    isLoadingPost: isPending,
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
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['comments', postID],
    queryFn: async () => {
      const { data } = await postService.getParentComments(postID);
      return data;
    },
    staleTime: Infinity
  });

  return {
    isLoadingComments: isPending,
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
  const aGToken = localStorage.getItem(GITHUB_TOKEN);

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['repository'],
    queryFn: async () => {
      const { data } = await userService.getRepositoryGithub();
      return data;
    },
    staleTime: Infinity,
    enabled: !!aGToken
  });

  return {
    isLoadingRepository: isPending,
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
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await messageService.getConversations();
      return data.metadata;
    },
    staleTime: Infinity
  });

  return {
    isLoadingConversations: isPending,
    isErrorConversations: isError,
    conversations: data!,
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
export const useCurrentConversationData = (conversationID: string | undefined) => {
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['conversation', conversationID],
    queryFn: async () => {
      const { data } = await messageService.getConversation(conversationID!);
      return data.metadata;
    },
    staleTime: Infinity,
    enabled: !!conversationID
  });

  return {
    isLoadingCurrentConversation: isPending,
    isErrorCurrentConversation: isError,
    currentConversation: data!,
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
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['followers', userID],
    queryFn: async () => {
      const { data } = await userService.getFollowers(userID);
      return data.metadata;
    },
    staleTime: Infinity
  });

  return {
    isLoadingFollowers: isPending,
    isErrorFollowers: isError,
    followers: data!,
    isFetchingFollowers: isFetching
  };
};

/**
 * The `useMessagesData` function is a custom hook that fetches and returns messages data for a given
 * conversation ID.
 * @param {string} conversationID - The conversationID parameter is a string that represents the unique
 * identifier of a conversation. It is used to fetch messages related to that conversation.
 * @returns The function `useMessagesData` returns an object with the following properties:
 * - `isLoadingMessages` is a boolean that indicates whether the messages data is still loading.
 * - `isErrorMessages` is a boolean that indicates whether there is an error.
 * - `messages` is an array of messages.
 * - `isFetchingMessages` is a boolean that indicates whether the query is currently fetching.
 * - `refetchMessages` is a function that refetches the messages data.
 */
export const useMessagesData = (conversationID: string) => {
  const queryClient = useQueryClient();
  const messages = queryClient.getQueryData<InfiniteData<MessageType[], number>>([
    'messages',
    conversationID
  ]);
  let extend = 0;
  if (messages) {
    if (messages.pages[messages.pages.length - 1].length >= 30) {
      extend = messages.pages[messages.pages.length - 1].length - 30;
    }
  }

  const { data, isPending, isError, isFetching, hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage } =
    useInfiniteQuery({
      queryKey: ['messages', conversationID],
      queryFn: async ({ pageParam }) => {
        const { data } = await messageService.getMessages(conversationID, pageParam, extend);
        return data.metadata;
      },
      initialPageParam: 1,
      getPreviousPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length === 0 || lastPage.length < 30) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      getNextPageParam: (_, __, firstPageParam) => {
        if (firstPageParam <= 1) {
          return undefined;
        }
        return firstPageParam - 1;
      },
      select: (data) => {
        return data.pages.flat();
      },
      staleTime: Infinity
    });

  return {
    isLoadingMessages: isPending,
    isErrorMessages: isError,
    messages: data!,
    isFetchingMessages: isFetching,
    hasPreviousMessages: hasPreviousPage,
    fetchPreviousMessages: fetchPreviousPage,
    isFetchingPreviousPage: isFetchingPreviousPage
  };
};

/**
 * The `useMessageCall` function is a custom hook that fetches video call data for a specific
 * conversation ID and type.
 * @param {string | undefined} conversationID - The conversationID parameter is a string that
 * represents the ID of the conversation for which the message call is being made. It is optional and
 * can be undefined if there is no conversation ID available.
 * @param {string} type - The `type` parameter is a string that represents the type of message call. It
 * could be "video", "audio", or any other type of call.
 * @returns The function `useMessageCall` returns an object with the following properties:
 * - `isLoadingMessageCall` is a boolean that indicates whether the message call data is still loading.
 * - `isErrorMessageCall` is a boolean that indicates whether there is an error.
 * - `tokenMessageCall` is an object that contains information about the message call token.
 * - `isFetchingMessageCall` is a boolean that indicates whether the query is currently fetching.
 * - `fetchMessageCall` is a function that refetches the message call data.
 */
export const useMessageCall = (conversationID: string | undefined, type: string) => {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['messageCall', conversationID, type],
    queryFn: async () => {
      const { data } = await messageService.getToken(conversationID, type);
      return data.metadata;
    },
    staleTime: Infinity,
    enabled: !!conversationID
  });

  return {
    isLoadingMessageCall: isPending,
    isErrorMessageCall: isError,
    dataMessageCall: data!,
    isFetchingMessageCall: isFetching,
    fetchMessageCall: refetch
  };
};
