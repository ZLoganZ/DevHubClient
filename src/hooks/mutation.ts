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
  ISocketCall,
  IUpdateConversation,
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
 */
export const useCreatePost = () => {
  const uid = useAppSelector((state) => state.auth.userID);

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (newPost: ICreatePost) => {
      const { data } = await postService.createPost(newPost);
      return data.metadata;
    },
    onSuccess(newPost) {
      queryClient.setQueryData<IPost[]>(['posts', uid], (oldData) => {
        if (!oldData) return;
        return [newPost, ...oldData];
      });
      queryClient.setQueryData<IPost[]>(['allNewsfeedPosts'], (oldData) => {
        if (!oldData) return;
        return [newPost, ...oldData];
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
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (post: IUpdatePost) => {
      const { data } = await postService.updatePost(post.id, post.postUpdate);
      return data.metadata;
    },
    onSuccess(updatedPost) {
      dispatch(setLoading(false));
      dispatch(closeDrawer());

      const updatePostData = (oldData: IPost[] | undefined) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.map((post) => {
          if (post._id === updatedPost._id) {
            return updatedPost;
          }
          return post;
        });
      };

      queryClient.setQueryData<IPost[]>(['posts', updatedPost.post_attributes.user._id], updatePostData);

      queryClient.setQueryData<IPost[]>(['allNewsfeedPosts'], updatePostData);

      void queryClient.invalidateQueries({ queryKey: ['post', updatedPost._id] });
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
 */
export const useCommentPost = () => {
  const queryClient = useQueryClient();

  const uid = useAppSelector((state) => state.auth.userID);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (commentData: ICreateComment) => {
      await postService.createComment(commentData);
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
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (user: IUserUpdate) => {
      const { data } = await userService.updateUser(user);
      return data.metadata;
    },
    onSuccess(updatedUser) {
      dispatch(setLoading(false));
      dispatch(closeDrawer());
      queryClient.setQueryData<IUserInfo>(['currentUserInfo'], (oldData) => {
        if (!oldData) return;

        return { ...oldData, ...updatedUser };
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
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (userID: string) => {
      await userService.followUser(userID);
    },
    onSuccess(_, userID) {
      queryClient.setQueryData<IUserInfo>(['currentUserInfo'], (oldData) => {
        if (!oldData) return;

        const index = oldData.following.findIndex((item) => item._id === userID);
        return {
          ...oldData,
          following_number: oldData.following_number + (index !== -1 ? -1 : 1)
        };
      });

      queryClient.setQueryData<IUserInfo>(['otherUserInfo', userID], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          follower_number: oldData.follower_number + (oldData.is_followed ? -1 : 1),
          is_followed: !oldData.is_followed
        };
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
 * @param {string} [conversationID] - The `conversationID` parameter is an optional string that
 * represents the ID of the conversation for which the message is being received. If provided, it is
 * used to determine whether to play a sound notification or not.
 */
export const useReceiveMessage = (currentUserID: string, conversationID?: string) => {
  const NotiMessage = new Audio('/sounds/sound-noti-message.wav');
  const PopMessage = new Audio('/sounds/bubble-popping-short.mp3');
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
          if (currentUserID !== message.sender._id) {
            if (conversationID === message.conversation_id) void PopMessage.play();
            else void NotiMessage.play();
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
        (oldData) => {
          if (!oldData) return;
          const newPages = [...oldData.pages];

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
              ...oldData,
              pages: newPages
            };
          } else {
            const lastPage = newPages[newPages.length - 1];
            const updatedLastPage = [...lastPage, message];

            newPages[newPages.length - 1] = updatedLastPage;

            return {
              ...oldData,
              pages: newPages
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

/**
 * The `useDissolveGroup` function is a custom hook that handles the mutation for dissolving a group
 * conversation and updates the query data accordingly.
 */
export const useDissolveGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (conversationID: string) => {
      await messageService.dissolveGroup(conversationID);
    },
    onSuccess(conversation, conversationID) {
      if (window.location.pathname.includes(conversationID)) navigate('/message', { replace: true });
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.filter((item) => item._id !== conversationID);
      });
      queryClient.setQueryData<IConversation>(['conversation', conversationID], undefined);

      chatSocket.emit(Socket.DISSOLVE_GROUP, conversation);
    }
  });

  return {
    mutateDissolveGroup: mutate,
    isLoadingDissolveGroup: isPending,
    isErrorDissolveGroup: isError,
    isSuccessDissolveGroup: isSuccess
  };
};

/**
 * The `useReceiveDissolveGroup` function is a custom hook that handles the mutation for updating
 * conversation data when a group is dissolved.
 */
export const useReceiveDissolveGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, isError, isSuccess, variables } = useMutation({
    mutationFn: async (conversation: IConversation) => await Promise.resolve(conversation),
    onSuccess(conversation) {
      if (window.location.pathname.includes(conversation._id)) navigate('/message', { replace: true });
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData];

        return newData.filter((item) => item._id !== conversation._id);
      });

      queryClient.setQueryData<IConversation>(['conversation', conversation._id], undefined);
    }
  });

  return {
    mutateReceiveDissolveGroup: mutate,
    isLoadingReceiveDissolveGroup: isPending,
    isErrorReceiveDissolveGroup: isError,
    isSuccessReceiveDissolveGroup: isSuccess,
    conversation: variables
  };
};

/**
 * The `useLeaveGroup` function is a custom hook in TypeScript that handles leaving a group
 * conversation, updating the conversation list, and emitting a socket event.
 */
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
      if (window.location.pathname.includes(conversationID)) navigate('/message', { replace: true });
      queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
        if (!oldData) return;

        const newData = [...oldData].filter((item) => item._id !== conversationID);

        return newData;
      });
      queryClient.setQueryData<IConversation>(['conversation', conversationID], undefined);

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

/**
 * The `useReceiveLeaveGroup` function is a custom hook that handles the mutation for updating
 * conversation data when a user leaves a group.
 */
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

/**
 * The `useMutateMessageCall` function is a custom hook in TypeScript that handles mutation for a
 * message call in a conversation.
 * @param {string | undefined} conversation_id - The conversation_id parameter is a string that
 * represents the ID of a conversation. It is used to identify the specific conversation for which the
 * message call is being made.
 * @param {string} type - The `type` parameter is a string that represents the type of message call. It
 * could be any value that you want to use to differentiate between different types of message calls.
 */
export const useMutateMessageCall = (conversation_id: string | undefined, type: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (data: ISocketCall) => await Promise.resolve(data),
    onSuccess(data) {
      queryClient.setQueryData<ISocketCall>(['messageCall', conversation_id, type], (oldData) => {
        if (!oldData) return;

        return { ...data };
      });
    }
  });

  return {
    mutateMessageCall: mutate,
    isLoadingMessageCall: isPending,
    isErrorMessageCall: isError,
    isSuccessMessageCall: isSuccess
  };
};

/**
 * The `useMutateConversation` function is a custom hook in TypeScript that handles mutations for
 * updating conversation data and updating the query cache.
 */
export const useMutateConversation = (currentUserID: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (payload: IUpdateConversation) => await Promise.resolve(payload),
    onSuccess(conversation) {
      switch (conversation.typeUpdate) {
        case 'name':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              newData[index] = {
                ...newData[index],
                name: conversation.name
              };
            }

            return newData;
          });

          queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              name: conversation.name
            };
          });
          break;
        case 'image':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              newData[index] = {
                ...newData[index],
                image: conversation.image
              };
            }

            return newData;
          });

          queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              image: conversation.image
            };
          });
          break;
        case 'cover_image':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              newData[index] = {
                ...newData[index],
                cover_image: conversation.cover_image
              };
            }

            return newData;
          });

          queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              cover_image: conversation.cover_image
            };
          });
          break;
        case 'add_member':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              newData[index] = {
                ...newData[index],
                members: conversation.members
              };
            } else {
              newData.unshift(conversation);
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
          break;
        case 'remove_member':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              const isHavingMe = newData[index].members.some((item) => item._id === currentUserID);
              const isHavingUser = conversation.members.some((item) => item._id === currentUserID);
              if (isHavingMe && !isHavingUser) {
                if (window.location.pathname.includes(conversation._id))
                  navigate('/message', { replace: true });
                newData.splice(index, 1);
              } else {
                newData[index] = {
                  ...newData[index],
                  members: conversation.members
                };
              }
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
          break;
        case 'commission_admin':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              newData[index] = {
                ...newData[index],
                admins: conversation.admins
              };
            }

            return newData;
          });

          queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              admins: conversation.admins
            };
          });
          break;
        case 'remove_admin':
          queryClient.setQueryData<IConversation[]>(['conversations'], (oldData) => {
            if (!oldData) return;

            const newData = [...oldData];

            const index = newData.findIndex((item) => item._id === conversation._id);

            if (index !== -1) {
              newData[index] = {
                ...newData[index],
                admins: conversation.admins
              };
            }

            return newData;
          });

          queryClient.setQueryData<IConversation>(['conversation', conversation._id], (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              admins: conversation.admins
            };
          });
          break;
        default:
          break;
      }
    }
  });

  return {
    mutateConversation: mutate,
    isLoadingConversation: isPending,
    isErrorConversation: isError,
    isSuccessConversation: isSuccess
  };
};
