import { useNavigate } from 'react-router-dom';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { closeDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';
import { postService } from '@/services/PostService';
import { userService } from '@/services/UserService';
import {
  IConversation,
  ICreateComment,
  ICreateLikeComment,
  ICreatePost,
  IMessage,
  IPost,
  ISharePost,
  IUpdatePost,
  IUserInfo,
  IUserUpdate
} from '@/types';
import { useAppDispatch, useAppSelector } from './special';
import { messageService } from '@/services/MessageService';
import { Socket } from '@/util/constants/SettingSystem';

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
    mutationFn: async (newPost: ICreatePost) => {
      const { data } = await postService.createPost(newPost);
      return data;
    },
    onSuccess(newPost) {
      queryClient.setQueryData<IPost[]>(['posts', uid], (oldData) => {
        if (oldData) return [newPost.metadata, ...oldData];
        return oldData;
      });
      queryClient.setQueryData<IPost[]>(['allNewsfeedPosts'], (oldData) => {
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
    mutationFn: async (post: IUpdatePost) => {
      const { data } = await postService.updatePost(post.id, post.postUpdate);
      return data;
    },
    onSuccess(updatedPost) {
      dispatch(setLoading(false));
      dispatch(closeDrawer());

      const updatePostData = (oldData: IPost[] | undefined) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.map((post) => {
          if (post._id === updatedPost.metadata._id) {
            return updatedPost.metadata;
          }
          return post;
        });
      };

      queryClient.setQueryData<IPost[]>(
        ['posts', updatedPost.metadata.post_attributes.user._id],
        updatePostData
      );

      queryClient.setQueryData<IPost[]>(['allNewsfeedPosts'], updatePostData);

      void queryClient.invalidateQueries({ queryKey: ['post', updatedPost.metadata._id] });
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
      const updatePostData = (oldData: IPost[] | undefined) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.filter((post) => post._id !== postID);
      };

      queryClient.setQueryData<IPost[]>(['posts', uid], updatePostData);

      queryClient.setQueryData<IPost[]>(['allNewsfeedPosts'], updatePostData);
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
    mutationFn: async (post: ISharePost) => {
      await postService.likePost(post);
    },
    onSuccess(_, postLike) {
      void queryClient.invalidateQueries({ queryKey: ['post', postLike.post] });
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
    mutationFn: async (post: ISharePost) => {
      await postService.sharePost(post);
    },
    onSuccess(_, postShare) {
      void queryClient.invalidateQueries({ queryKey: ['post', postShare.post] });
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
      void queryClient.invalidateQueries({ queryKey: ['post', postID] });
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
    mutationFn: async (commentData: ICreateComment) => {
      const { data } = await postService.createComment(commentData);
      return data;
    },
    onSuccess(_, newComment) {
      void queryClient.invalidateQueries({ queryKey: ['comments', newComment.post] });

      void queryClient.invalidateQueries({ queryKey: ['post', newComment.post] });

      const updatePostData = (oldData: IPost[] | undefined) => {
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

      queryClient.setQueryData<IPost[]>(['allNewsfeedPosts'], updatePostData);

      queryClient.setQueryData<IPost[]>(['posts', uid], updatePostData);
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
    mutationFn: async (payload: ICreateLikeComment) => {
      await postService.likeComment(payload.id, payload.comment);
    },
    onSuccess(_, payload) {
      void queryClient.invalidateQueries({ queryKey: ['comments', payload.comment.post] });
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
    mutationFn: async (payload: ICreateLikeComment) => {
      await postService.dislikeComment(payload.id, payload.comment);
    },
    onSuccess(_, payload) {
      void queryClient.invalidateQueries({ queryKey: ['comments', payload.comment.post] });
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
    mutationFn: async (user: IUserUpdate) => {
      const { data } = await userService.updateUser(user);
      return data;
    },
    onSuccess(updatedUser) {
      dispatch(setLoading(false));
      dispatch(closeDrawer());
      queryClient.setQueryData<IUserInfo>(['currentUserInfo'], (oldData) => {
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
      queryClient.setQueryData<IUserInfo>(['currentUserInfo'], (oldData) => {
        if (oldData) {
          const index = oldData.following.findIndex((item) => item._id === userID);
          return {
            ...oldData,
            following_number: oldData.following_number + (index !== -1 ? -1 : 1)
          };
        }

        return oldData;
      });

      queryClient.setQueryData<IUserInfo>(['otherUserInfo', userID], (oldData) => {
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

/**
 * The `useSendMessage` function is a custom hook in TypeScript that handles sending a message and
 * updating the query data for conversations and messages.
 * @returns The `useSendMessage` hook returns an object with the following properties:
 * - `mutateSendMessage` is a function that handles the mutation of the message.
 * - `isLoadingSendMessage` is a boolean that indicates whether the message is still loading.
 * - `isErrorSendMessage` is a boolean that indicates whether there is an error.
 * - `isSuccessSendMessage` is a boolean that indicates whether the message was successfully sent.
 * - `message` is the message object.
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (message: IMessage) => await Promise.resolve(message),
    onSuccess(message) {
      queryClient.setQueryData<InfiniteData<IMessage[], number>>(
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

      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
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
          const aTime = a.lastMessage?.createdAt ?? 0;
          const bTime = b.lastMessage?.createdAt ?? 0;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });

      queryClient.setQueryData<IConversation>(['conversation', message.conversation_id], (oldData) => {
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

/**
 * The `useReceiveMessage` function is a custom hook in TypeScript that handles receiving and updating
 * messages in a conversation.
 * @returns The `useReceiveMessage` hook returns an object with the following properties:
 * - `mutateReceiveMessage` is a function that handles the mutation of the message.
 * - `isLoadingReceiveMessage` is a boolean that indicates whether the message is still loading.
 * - `isErrorReceiveMessage` is a boolean that indicates whether there is an error.
 * - `isSuccessReceiveMessage` is a boolean that indicates whether the message was successfully received.
 * - `message` is the message object.
 */
export const useReceiveMessage = (selected?: boolean) => {
  const NotiMessage = new Audio('/sounds/sound-noti-message.wav');
  const PopMessage = new Audio('/sounds/bubble-popping-short.mp4');
  NotiMessage.volume = 0.3;

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (message: IMessage) => await Promise.resolve(message),
    onSuccess(message) {
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        const index = newData.findIndex((item) => item._id === message.conversation_id);

        if (index !== -1) {
          if (newData[index].lastMessage?._id !== message._id) {
            if (!selected) void NotiMessage.play();
            else void PopMessage.play();
          }

          newData[index] = {
            ...newData[index],
            lastMessage: message,
            seen: []
          };

          newData.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt ?? 0;
            const bTime = b.lastMessage?.createdAt ?? 0;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
        }

        return newData;
      });

      queryClient.setQueryData<IConversation>(['conversation', message.conversation_id], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          lastMessage: message,
          seen: []
        };
      });

      queryClient.setQueryData<InfiniteData<IMessage[], number>>(
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

/**
 * The `useReceiveConversation` function is a custom hook that handles the mutation of a conversation
 * object and updates the query data for conversations.
 * @returns The function `useReceiveConversation` returns an object with the following properties:
 * - `mutateReceiveConversation` is a function that handles the mutation of the conversation.
 * - `isLoadingReceiveConversation` is a boolean that indicates whether the conversation is still loading.
 * - `isErrorReceiveConversation` is a boolean that indicates whether there is an error.
 * - `isSuccessReceiveConversation` is a boolean that indicates whether the conversation was successfully received.
 * - `conversation` is the conversation object.
 */
export const useReceiveConversation = () => {
  const NotiMessage = new Audio('/sounds/sound-noti-message.wav');
  NotiMessage.volume = 0.3;

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (conversation: IConversation) => await Promise.resolve(conversation),
    onSuccess(conversation) {
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
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
          void NotiMessage.play();
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

/**
 * The `useReceiveSeenConversation` function is a custom hook in TypeScript that handles the mutation
 * of a conversation's "seen" status and updates the query data accordingly.
 * @returns The function `useReceiveSeenConversation` returns an object with the following
 * properties:
 * - `mutateReceiveSeenConversation` is a function that handles the mutation of the conversation.
 * - `isLoadingReceiveSeenConversation` is a boolean that indicates whether the conversation is still
 * loading.
 * - `isErrorReceiveSeenConversation` is a boolean that indicates whether there is an error.
 * - `isSuccessReceiveSeenConversation` is a boolean that indicates whether the conversation was
 * successfully received.
 * - `conversation` is the conversation object.
 */
export const useReceiveSeenConversation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (conversation: IConversation) => await Promise.resolve(conversation),
    onSuccess(conversation) {
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
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

      queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
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

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (conversationID: string) => {
      await messageService.deleteConversation(conversationID);
    },
    onSuccess(_, conversationID) {
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.filter((item) => item._id !== conversationID);
      });
    }
  });

  return {
    mutateDeleteConversation: mutate,
    isLoadingDeleteConversation: isPending,
    isErrorDeleteConversation: isError,
    isSuccessDeleteConversation: isSuccess
  };
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (conversationID: string) => {
      const { data } = await messageService.leaveGroup(conversationID);
      return data.metadata;
    },
    onSuccess(conversation, conversationID) {
      if (window.location.pathname.includes(conversationID)) navigate('/message');
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData].filter((item) => item._id !== conversationID);

        return newData;
      });

      chatSocket.emit(Socket.LEAVE_GROUP, conversation);
    }
  });

  return {
    mutateLeaveGroup: mutate,
    isLoadingLeaveGroup: isPending,
    isErrorLeaveGroup: isError,
    isSuccessLeaveGroup: isSuccess
  };
};

export const useReceiveLeaveGroup = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (conversation: IConversation) => await Promise.resolve(conversation),
    onSuccess(conversation) {
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        const index = newData.findIndex((item) => item._id === conversation._id);

        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            members: conversation.members
          };
        }

        return newData;
      });

      queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          members: conversation.members
        };
      });
    }
  });

  return {
    mutateReceiveLeaveGroup: mutate,
    isLoadingReceiveLeaveGroup: isPending,
    isErrorReceiveLeaveGroup: isError,
    isSuccessReceiveLeaveGroup: isSuccess,
    conversation: variables
  };
};
