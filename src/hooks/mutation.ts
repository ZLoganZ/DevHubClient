import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { closeDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';
import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import {
  ConversationType,
  CreateCommentDataType,
  CreateLikeCommentType,
  CreatePostDataType,
  MessageType,
  PostType,
  SharePostDataType,
  UpdatePostDataType,
  UserInfoType,
  UserUpdateDataType
} from '@/types';
import { useAppDispatch, useAppSelector } from './special';

// ----------------------------- MUTATIONS -----------------------------

/**
 * The `useCreatePost` function is a custom hook that handles the creation of a new post, including
 * making an API request and updating the query data for the user's posts and the newsfeed.
 * @returns The `useCreatePost` function returns an object with the following properties:
 * - `mutateCreatePost` is a function that handles the mutation of the post.
 * - `isLoadingCreatePost` is a boolean that indicates whether the post is still loading.
 * - `isErrorCreatePost` is a boolean that indicates whether there is an error.
 * - `isSuccessCreatePost` is a boolean that indicates whether the post was successfully created.
 */
export const useCreatePost = () => {
  const uid = useAppSelector((state) => state.auth.userID);

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (newPost: CreatePostDataType) => {
      const { data } = await postService.createPost(newPost);
      return data;
    },
    onSuccess(newPost) {
      queryClient.setQueryData<PostType[]>(['posts', uid], (oldData) => {
        if (oldData) return [newPost.metadata, ...oldData];
        return oldData;
      });
      queryClient.setQueryData<PostType[]>(['allNewsfeedPosts'], (oldData) => {
        if (oldData) return [newPost.metadata, ...oldData];
        return oldData;
      });
    }
  });
  return {
    mutateCreatePost: mutate,
    isLoadingCreatePost: isPending,
    isErrorCreatePost: isError,
    isSuccessCreatePost: isSuccess
  };
};

/**
 * The `useViewPost` function is a custom hook that handles the logic for viewing a post, including
 * making a mutation request to the server and updating the cache.
 * @returns The `useViewPost` function returns an object with the following properties:
 * - `mutateViewPost` is a function that handles the mutation of the post.
 * - `isLoadingViewPost` is a boolean that indicates whether the post is still loading.
 * - `isErrorViewPost` is a boolean that indicates whether there is an error.
 * - `isSuccessViewPost` is a boolean that indicates whether the post was successfully viewed.
 */
export const useViewPost = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (postID: string) => {
      await postService.viewPost(postID);
    }
  });
  return {
    mutateViewPost: mutate,
    isLoadingViewPost: isPending,
    isErrorViewPost: isError,
    isSuccessViewPost: isSuccess
  };
};

/**
 * The `useUpdatePost` function is a custom hook that handles the mutation logic for updating a post,
 * including invalidating relevant query caches.
 * @returns The `useUpdatePost` hook returns an object with the following properties:
 * - `mutateUpdatePost` is a function that handles the mutation of the post.
 * - `isLoadingUpdatePost` is a boolean that indicates whether the post is still loading.
 * - `isErrorUpdatePost` is a boolean that indicates whether there is an error.
 * - `isSuccessUpdatePost` is a boolean that indicates whether the post was successfully updated.
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (post: UpdatePostDataType) => {
      const { data } = await postService.updatePost(post.id, post.postUpdate);
      return data;
    },
    onSuccess(updatedPost) {
      dispatch(setLoading(false));
      dispatch(closeDrawer());

      const updatePostData = (oldData: PostType[] | undefined) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.map((post) => {
          if (post._id === updatedPost.metadata._id) {
            return updatedPost.metadata;
          }
          return post;
        });
      };

      queryClient.setQueryData<PostType[]>(
        ['posts', updatedPost.metadata.post_attributes.user._id],
        updatePostData
      );

      queryClient.setQueryData<PostType[]>(['allNewsfeedPosts'], updatePostData);

      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.metadata._id] });
    }
  });
  return {
    mutateUpdatePost: mutate,
    isLoadingUpdatePost: isPending,
    isErrorUpdatePost: isError,
    isSuccessUpdatePost: isSuccess
  };
};

/**
 * The `useDeletePost` function is a custom hook that handles the deletion of a post and invalidates
 * the relevant query caches upon success.
 * @returns The `useDeletePost` function returns an object with the following properties:
 * - `mutateDeletePost` is a function that handles the mutation of the post.
 * - `isLoadingDeletePost` is a boolean that indicates whether the post is still loading.
 * - `isErrorDeletePost` is a boolean that indicates whether there is an error.
 * - `isSuccessDeletePost` is a boolean that indicates whether the post was successfully deleted.
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const uid = useAppSelector((state) => state.auth.userID);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (postID: string) => {
      await postService.deletePost(postID);
    },
    onSuccess(_, postID) {
      const updatePostData = (oldData: PostType[] | undefined) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.filter((post) => post._id !== postID);
      };

      queryClient.setQueryData<PostType[]>(['posts', uid], updatePostData);

      queryClient.setQueryData<PostType[]>(['allNewsfeedPosts'], updatePostData);
    }
  });
  return {
    mutateDeletePost: mutate,
    isLoadingDeletePost: isPending,
    isErrorDeletePost: isError,
    isSuccessDeletePost: isSuccess
  };
};

/**
 * The `useLikePost` function is a custom hook that handles the logic for liking a post, including
 * making the API call and updating the cache.
 * @returns The `useLikePost` function returns an object with the following properties:
 * - `mutateLikePost` is a function that handles the mutation of the post.
 * - `isLoadingLikePost` is a boolean that indicates whether the post is still loading.
 * - `isErrorLikePost` is a boolean that indicates whether there is an error.
 * - `isSuccessLikePost` is a boolean that indicates whether the post was successfully liked.
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (post: SharePostDataType) => {
      await postService.likePost(post);
    },
    onSuccess(_, postLike) {
      queryClient.invalidateQueries({
        queryKey: ['post', postLike.post]
      });
    }
  });
  return {
    mutateLikePost: mutate,
    isLoadingLikePost: isPending,
    isErrorLikePost: isError,
    isSuccessLikePost: isSuccess
  };
};

/**
 * The `useSharePost` function is a custom hook that handles the mutation logic for sharing a post,
 * including invalidating the post query cache on success.
 * @returns The `useSharePost` function returns an object with the following properties:
 * - `mutateSharePost` is a function that handles the mutation of the post.
 * - `isLoadingSharePost` is a boolean that indicates whether the post is still loading.
 * - `isErrorSharePost` is a boolean that indicates whether there is an error.
 * - `isSuccessSharePost` is a boolean that indicates whether the post was successfully shared.
 */
export const useSharePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (post: SharePostDataType) => {
      await postService.sharePost(post);
    },
    onSuccess(_, postShare) {
      queryClient.invalidateQueries({
        queryKey: ['post', postShare.post]
      });
    }
  });
  return {
    mutateSharePost: mutate,
    isLoadingSharePost: isPending,
    isErrorSharePost: isError,
    isSuccessSharePost: isSuccess
  };
};

/**
 * The `useSavePost` function is a custom hook that handles saving a post, invalidating the post query
 * cache on success.
 * @returns The function `useSavePost` returns an object with the following properties:
 * - `mutateSavePost` is a function that handles the mutation of the post.
 * - `isLoadingSavePost` is a boolean that indicates whether the post is still loading.
 * - `isErrorSavePost` is a boolean that indicates whether there is an error.
 * - `isSuccessSavePost` is a boolean that indicates whether the post was successfully saved.
 */
export const useSavePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (postID: string) => {
      await postService.savePost(postID);
    },
    onSuccess(_, postID) {
      queryClient.invalidateQueries({
        queryKey: ['post', postID]
      });
    }
  });
  return {
    mutateSavePost: mutate,
    isLoadingSavePost: isPending,
    isErrorSavePost: isError,
    isSuccessSavePost: isSuccess
  };
};

/**
 * The `useCommentPost` function is a custom hook that handles the creation of a new comment and
 * invalidates the comments query cache upon success.
 * @returns The `useCommentPost` function returns an object with the following properties:
 * - `mutateCommentPost` is a function that handles the mutation of the comment.
 * - `isLoadingCommentPost` is a boolean that indicates whether the comment is still loading.
 * - `isErrorCommentPost` is a boolean that indicates whether there is an error.
 * - `isSuccessCommentPost` is a boolean that indicates whether the comment was successfully created.
 */
export const useCommentPost = () => {
  const queryClient = useQueryClient();

  const uid = useAppSelector((state) => state.auth.userID);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (commentData: CreateCommentDataType) => {
      const { data } = await postService.createComment(commentData);
      return data;
    },
    onSuccess(_, newComment) {
      queryClient.invalidateQueries({
        queryKey: ['comments', newComment.post]
      });

      queryClient.invalidateQueries({
        queryKey: ['post', newComment.post]
      });

      const updatePostData = (oldData: PostType[] | undefined) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.map((post) => {
          if (post._id === newComment.post) {
            return {
              ...post,
              post_attributes: {
                ...post.post_attributes,
                comment_number: post.post_attributes.comment_number + 1
              }
            };
          }
          return post;
        });
      };

      queryClient.setQueryData<PostType[]>(['allNewsfeedPosts'], updatePostData);

      queryClient.setQueryData<PostType[]>(['posts', uid], updatePostData);
    }
  });
  return {
    mutateCommentPost: mutate,
    isLoadingCommentPost: isPending,
    isErrorCommentPost: isError,
    isSuccessCommentPost: isSuccess
  };
};

/**
 * The `useLikeComment` function is a custom hook that handles the logic for liking a comment and
 * invalidating the cache for the comments associated with the post.
 * @returns The function `useLikeComment` returns an object with the following properties:
 * - `mutateLikeComment` is a function that handles the mutation of the comment.
 * - `isLoadingLikeComment` is a boolean that indicates whether the comment is still loading.
 * - `isErrorLikeComment` is a boolean that indicates whether there is an error.
 * - `isSuccessLikeComment` is a boolean that indicates whether the comment was successfully liked.
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (payload: CreateLikeCommentType) => {
      await postService.likeComment(payload.id, payload.comment);
    },
    onSuccess(_, payload) {
      queryClient.invalidateQueries({
        queryKey: ['comments', payload.comment.post]
      });
    }
  });
  return {
    mutateLikeComment: mutate,
    isLoadingLikeComment: isPending,
    isErrorLikeComment: isError,
    isSuccessLikeComment: isSuccess
  };
};

/**
 * The `useDislikeComment` function is a custom hook that handles the logic for disliking a comment,
 * including making the API request and updating the cache.
 * @returns The `useDislikeComment` function returns an object with the following properties:
 * - `mutateDislikeComment` is a function that handles the mutation of the comment.
 * - `isLoadingDislikeComment` is a boolean that indicates whether the comment is still loading.
 * - `isErrorDislikeComment` is a boolean that indicates whether there is an error.
 * - `isSuccessDislikeComment` is a boolean that indicates whether the comment was successfully
 */
export const useDislikeComment = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (payload: CreateLikeCommentType) => {
      await postService.dislikeComment(payload.id, payload.comment);
    },
    onSuccess(_, payload) {
      queryClient.invalidateQueries({
        queryKey: ['comments', payload.comment.post]
      });
    }
  });
  return {
    mutateDislikeComment: mutate,
    isLoadingDislikeComment: isPending,
    isErrorDislikeComment: isError,
    isSuccessDislikeComment: isSuccess
  };
};

/**
 * The `useUpdateUser` function is a custom hook that handles updating a user's information and
 * invalidating the 'currentUserInfo' query in the query cache upon success.
 * @returns The function `useUpdateUser` returns an object with the following properties:
 * - `mutateUpdateUser` is a function that handles the mutation of the user.
 * - `isLoadingUpdateUser` is a boolean that indicates whether the user is still loading.
 * - `isErrorUpdateUser` is a boolean that indicates whether there is an error.
 * - `isSuccessUpdateUser` is a boolean that indicates whether the user was successfully updated.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (user: UserUpdateDataType) => {
      const { data } = await userService.updateUser(user);
      return data;
    },
    onSuccess(updatedUser) {
      dispatch(setLoading(false));
      dispatch(closeDrawer());
      queryClient.setQueryData<UserInfoType>(['currentUserInfo'], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          ...updatedUser.metadata
        };
      });
    }
  });
  return {
    mutateUpdateUser: mutate,
    isLoadingUpdateUser: isPending,
    isErrorUpdateUser: isError,
    isSuccessUpdateUser: isSuccess
  };
};

/**
 * The `useFollowUser` function is a custom hook that handles following a user, including making the
 * API call, handling loading and error states, and invalidating relevant queries in the query cache.
 * @returns The `useFollowUser` function returns an object with the following properties:
 * - `mutateFollowUser` is a function that handles the mutation of the follow user.
 * - `isLoadingFollowUser` is a boolean that indicates whether the follow user is still loading.
 * - `isErrorFollowUser` is a boolean that indicates whether there is an error.
 * - `isSuccessFollowUser` is a boolean that indicates whether the follow user was successful.
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (userID: string) => {
      await userService.followUser(userID);
    },
    onSuccess(_, userID) {
      queryClient.setQueryData<UserInfoType>(['currentUserInfo'], (oldData) => {
        if (oldData) {
          const index = oldData.following.findIndex((item) => item._id === userID);
          return {
            ...oldData,
            following_number: oldData.following_number + (index !== -1 ? -1 : 1)
          };
        }

        return oldData;
      });

      queryClient.setQueryData<UserInfoType>(['otherUserInfo', userID], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            follower_number: oldData.follower_number + (oldData.is_followed ? -1 : 1),
            is_followed: !oldData.is_followed
          };
        }

        return oldData;
      });
    }
  });
  return {
    mutateFollowUser: mutate,
    isLoadingFollowUser: isPending,
    isErrorFollowUser: isError,
    isSuccessFollowUser: isSuccess
  };
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (message: MessageType) => message,
    onSuccess(message) {
      queryClient.setQueryData<InfiniteData<MessageType[], number>>(
        ['messages', message.conversation_id],
        (oldData) => {
          if (!oldData) return;

          const newPages = [...oldData.pages];

          const lastPage = newPages[newPages.length - 1];
          const updatedLastPage = [...lastPage, message];

          newPages[newPages.length - 1] = updatedLastPage;

          return {
            ...oldData,
            pages: newPages
          };
        }
      );

      queryClient.setQueryData<ConversationType[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        const index = newData.findIndex((item) => item._id === message.conversation_id);

        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            lastMessage: message,
            seen: []
          };
        }

        return newData.sort((a, b) => {
          const aTime = a.lastMessage?.createdAt || 0;
          const bTime = b.lastMessage?.createdAt || 0;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });

      queryClient.setQueryData<ConversationType>(['conversation', message.conversation_id], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          lastMessage: message,
          seen: []
        };
      });
    }
  });
  return {
    mutateSendMessage: mutate,
    isLoadingSendMessage: isPending,
    isErrorSendMessage: isError,
    isSuccessSendMessage: isSuccess,
    message: variables
  };
};

export const useReceiveMessage = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (message: MessageType) => message,
    onSuccess(message) {
      queryClient.setQueryData<ConversationType[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        const index = newData.findIndex((item) => item._id === message.conversation_id);

        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            lastMessage: message,
            seen: []
          };

          newData.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt || 0;
            const bTime = b.lastMessage?.createdAt || 0;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
        }

        return newData;
      });

      queryClient.setQueryData<ConversationType>(['conversation', message.conversation_id], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          lastMessage: message,
          seen: []
        };
      });

      queryClient.setQueryData<InfiniteData<MessageType[], number>>(
        ['messages', message.conversation_id],
        (messages) => {
          if (!messages) return;
          const newPages = [...messages.pages];

          const pageIndex = newPages.findIndex((page) => page.some((item) => item._id === message._id));

          if (pageIndex !== -1) {
            const newPage = newPages[pageIndex].map((msg) => {
              if (msg._id === message._id) {
                return { ...msg, isSending: false };
              }
              return msg;
            });

            newPages[pageIndex] = newPage;

            return {
              pages: newPages,
              pageParams: messages.pageParams
            };
          } else {
            const lastPage = newPages[newPages.length - 1];
            const updatedLastPage = [...lastPage, message];

            newPages[newPages.length - 1] = updatedLastPage;

            return {
              pages: newPages,
              pageParams: [...messages.pageParams]
            };
          }
        }
      );
    }
  });

  return {
    mutateReceiveMessage: mutate,
    isLoadingReceiveMessage: isPending,
    isErrorReceiveMessage: isError,
    isSuccessReceiveMessage: isSuccess,
    message: variables
  };
};

export const useReceiveConversation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (conversation: ConversationType) => conversation,
    onSuccess(conversation) {
      queryClient.setQueryData<ConversationType[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        const index = newData.findIndex((item) => item._id === conversation._id);

        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            updatedAt: conversation.updatedAt
          };

          newData.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
        } else {
          newData.unshift(conversation);
        }

        return newData;
      });
    }
  });

  return {
    mutateReceiveConversation: mutate,
    isLoadingReceiveConversation: isPending,
    isErrorReceiveConversation: isError,
    isSuccessReceiveConversation: isSuccess,
    conversation: variables
  };
};

export const useReceiveSeenConversation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (conversation: ConversationType) => conversation,
    onSuccess(conversation) {
      queryClient.setQueryData<ConversationType[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        const index = newData.findIndex((item) => item._id === conversation._id);

        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            seen: conversation.seen
          };
        }

        return newData;
      });

      queryClient.setQueryData<ConversationType>(['conversation', conversation._id], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          seen: conversation.seen
        };
      });
    }
  });

  return {
    mutateReceiveSeenConversation: mutate,
    isLoadingReceiveSeenConversation: isPending,
    isErrorReceiveSeenConversation: isError,
    isSuccessReceiveSeenConversation: isSuccess,
    conversation: variables
  };
};
