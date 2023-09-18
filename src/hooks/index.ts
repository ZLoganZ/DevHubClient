import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { setUser } from '@/redux/Slice/UserSlice';
import {
  setAllPost,
  setIsInProfile,
  setPostArr
} from '@/redux/Slice/PostSlice';
import { postService } from '@/services/PostService';
import { messageService } from '@/services/MessageService';
import { userService } from '@/services/UserService';
import { AppDispatch, RootState } from '@/redux/configStore';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * The `useIntersectionObserver` function is a custom React hook that uses the Intersection Observer
 * API to detect when a target element intersects with the viewport and triggers a callback function
 * after a specified time (default is 5000 milliseconds).
 * @param targetRef - A mutable ref object that represents the target element to observe for
 * intersection.
 * @param onIntersect - The `onIntersect` parameter is a callback function that will be called when the
 * target element intersects with the viewport. It can be used to perform some action or trigger some
 * behavior when the intersection occurs.
 * @param {number} [time=5000] - The `time` parameter is an optional parameter that specifies the
 * duration (in milliseconds) for which the target element needs to be continuously intersecting with
 * the viewport before triggering the `onIntersect` callback function. If the target element is
 * continuously intersecting with the viewport for the specified duration, the  `onIntersect` callback
 * function will be called. If the target element is no longer intersecting with the viewport before
 * the specified duration, the `onIntersect` callback function will not be called.
 */
export const useIntersectionObserver = (
  targetRef: React.MutableRefObject<null>,
  onIntersect: () => void,
  time: number = 5000
) => {
  useEffect(() => {
    let intersectTimeoutID: any;
    let intersectTime: any;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectTime = intersectTime || Date.now();
            intersectTimeoutID = setInterval(() => {
              if (Date.now() - intersectTime >= time) {
                clearInterval(intersectTimeoutID);
                onIntersect();
              }
            }, 100);
          } else {
            clearInterval(intersectTimeoutID);
            intersectTime = null;
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      clearInterval(intersectTimeoutID);
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, onIntersect]);
};

/**
 * The `useIntersectionObserverNow` function is a custom React hook that uses the Intersection Observer
 * API to detect when a target element intersects with the viewport and calls a callback function when
 * it does.
 * @param targetRef - The targetRef is a React mutable ref object that refers to the element that you
 * want to observe for intersection. It is typically created using the useRef() hook and passed as a
 * parameter to the useIntersectionObserverNow hook.
 * @param onIntersect - The `onIntersect` parameter is a callback function that will be called when the
 * target element intersects with the viewport. It is typically used to trigger some action or update
 * the UI when the element becomes visible to the user.
 */
export const useIntersectionObserverNow = (
  targetRef: React.RefObject<HTMLDivElement>,
  onIntersect: () => void
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 1.0
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, onIntersect]);
};

/**
 * The `useOtherUser` function returns the information of the other user in a conversation, including
 * their username.
 * @param {any} conversation - The `conversation` parameter is an object that represents a
 * conversation. It likely contains information about the users involved in the conversation, such as
 * their IDs and usernames.
 * @returns The function `useOtherUser` returns the information of the other user in a conversation.
 */
export const useOtherUser = (conversation: any) => {
  const userInfo = useAppSelector((state) => state.userReducer.userInfo);

  const otherUser = useMemo(() => {
    const currentUser = userInfo?.id;

    const otherUser = conversation?.users?.filter(
      (user: any) => user._id !== currentUser
    );

    const otherUserInfo = {
      ...otherUser[0],
      username: otherUser[0].lastname + ' ' + otherUser[0].firstname
    };

    return otherUserInfo;
  }, [userInfo, conversation.users]);

  return otherUser;
};

export const useUserInfo = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const { data } = await userService.getUserInfo();
      return data;
    },
    staleTime: Infinity,
    onSuccess(data) {
      dispatch(setUser(data.metadata));
    }
  });

  return {
    isLoading,
    isError,
    userInfo: data?.metadata,
    isFetching
  };
};

/**
 * The `useAllPostsData` function is a custom hook that fetches all posts data, sets the loading and
 * error states, and returns the fetched data along with additional information.
 * @returns The function `useAllPostsData` returns an object with the following properties:
 * - `isLoading` is a boolean that indicates whether the data is still loading.
 * - `isError` is a boolean that indicates whether there is an error.
 * - `allPost` is an array of all posts.
 * - `userInfo` is an object that contains information about the user.
 * - `isFetching` is a boolean that indicates whether the query is currently fetching.
 */
export const useAllPostsData = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      dispatch(setIsInProfile(false));
      const { data } = await postService.getAllPost();
      return data;
    },
    staleTime: Infinity,
    onSuccess(data) {
      dispatch(setAllPost(data.metadata));
    },
    onError(err) {
      console.log(err);
    }
  });

  return {
    isLoading,
    isError,
    allPost: data?.metadata,
    isFetching,
    refetchPosts: refetch
  };
};

/**
 * The `usePostsData` function is a custom hook that fetches and returns data related to posts, user
 * information, and owner information based on a given userID.
 * @param {string} userID - The userID parameter is a string that represents the user ID for which the
 * posts data is being fetched.
 * @returns The function `usePostsData` returns an object with the following properties:
 * - `isLoading` is a boolean that indicates whether the data is still loading.
 * - `isError` is a boolean that indicates whether there is an error.
 * - `postArray` is an array of posts.
 * - `userInfo` is an object that contains information about the user.
 * - `ownerInfo` is an object that contains information about the owner.
 * - `isFetching` is a boolean that indicates whether the query is currently fetching.
 */
export const usePostsData = (userID: string) => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['posts', userID],
    queryFn: async () => {
      if (userID === 'me') {
        dispatch(setIsInProfile(true));
      } else {
        dispatch(setIsInProfile(false));
      }
      const { data } = await postService.getAllPostByUserID(userID);
      return data;
    },
    enabled: !!userID,
    staleTime: Infinity,
    onSuccess(data) {
      dispatch(setPostArr(data.metadata));
    },
    onError(err) {
      console.log(err);
    }
  });

  return {
    isLoading,
    isError,
    postArray: data?.metadata,
    isFetching
  };
};

/**
 * The `useConversationsData` function is a custom hook that fetches conversations data and returns
 * loading, error, and data states.
 * @returns The function `useConversationsData` returns an object with the following properties:
 * - `isLoadingConversations` is a boolean that indicates whether the conversations data is still
 * loading.
 * - `isError` is a boolean that indicates whether there is an error.
 * - `conversations` is an array of conversations.
 * - `isFetching` is a boolean that indicates whether the query is currently fetching.
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
    isError,
    conversations: data?.content?.conversations,
    isFetching
  };
};

/**
 * The function `useCurrentConversationData` is a custom hook that retrieves and returns the current
 * conversation data based on the provided conversation ID.
 * @param {string | undefined} conversationID - The conversationID parameter is a string that
 * represents the ID of the conversation for which we want to fetch data.
 * @returns The function `useCurrentConversationData` returns an object with the following properties:
 * - `isLoadingConversation` is a boolean that indicates whether the conversation data is still
 * loading.
 * - `isError` is a boolean that indicates whether there is an error.
 * - `currentConversation` is an object that contains information about the current conversation.
 * - `isFetching` is a boolean that indicates whether the query is currently fetching.
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
    isLoadingConversation: isLoading,
    isError,
    currentConversation: data?.content?.conversation,
    isFetching
  };
};

/**
 * The `useFollowersData` function is a custom hook that fetches and returns data about a user's
 * followers, including loading and error states.
 * @param {string} userID - The `userID` parameter is a string that represents the ID of the user for
 * whom we want to fetch the followers data.
 * @returns The function `useFollowersData` returns an object with the following properties:
 * - `isLoadingFollowers` is a boolean that indicates whether the followers data is still loading.
 * - `isError` is a boolean that indicates whether there is an error.
 * - `followers` is an array of followers.
 * - `isFetching` is a boolean that indicates whether the query is currently fetching.
 */
export const useFollowersData = (userID: string) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['followers', userID],
    queryFn: async () => {
      const { data } = await userService.getFollowers(userID);
      data.metadata.followers.forEach((follower) => {
        follower.username = follower.lastname + ' ' + follower.firstname;
      });
      return data;
    },
    enabled: !!userID
  });

  return {
    isLoadingFollowers: isLoading,
    isError,
    followers: data?.metadata.followers,
    isFetching
  };
};

/**
 * The `useMessagesData` function is a custom hook that fetches messages data for a given conversation
 * ID and provides loading, error, data, and refetching functionality.
 * @param {any} conversationID - The conversationID parameter is the unique identifier for a
 * conversation. It is used to fetch the messages associated with that conversation.
 * @returns The function `useMessagesData` returns an object with the following properties:
 * - `isLoadingMessages` is a boolean that indicates whether the messages data is still loading.
 * - `isError` is a boolean that indicates whether there is an error.
 * - `messages` is an array of messages.
 * - `isFetching` is a boolean that indicates whether the query is currently fetching.
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
    isError,
    messages: data?.content?.messages,
    isFetching,
    refetchMessages: refetch
  };
};

export const useUpdateAllPosts = () => {
  const queryClient = useQueryClient();

  return queryClient.invalidateQueries(['allPosts']);
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const { isInProfile } = useAppSelector((state) => state.postReducer);

  const { mutate, isLoading, isError, isSuccess } = useMutation(
    async (newPost: any) => {
      const { data } = await postService.createPost(newPost);
      return data;
    },
    {
      onSuccess(data) {
        if (isInProfile) {
          queryClient.setQueryData(['allPosts'], (oldData: any) => {
            return {
              ...oldData,
              content: {
                ...oldData.content,
                allPostArr: [...oldData.content.allPostArr, data]
              }
            };
          });
        } else {
          queryClient.invalidateQueries(['posts']);
        }
      }
    }
  );
  return { mutate, isLoading, isError, isSuccess };
};
