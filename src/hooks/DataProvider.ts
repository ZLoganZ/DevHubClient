import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { setUser } from "@/redux/Slice/UserSlice";
import {
  setAllPost,
  setIsInProfile,
  setOwnerInfo,
  setPostArr,
} from "@/redux/Slice/PostSlice";
import { postService } from "@/services/PostService";
import { messageService } from "@/services/MessageService";
import { userService } from "@/services/UserService";

const useAllPostsData = () => {
  const dispatch = useDispatch();
  // const allPost = useSelector((state: any) => state.postReducer.allPost);
  // const userInfo = useSelector((state: any) => state.userReducer.userInfo);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      dispatch(setIsInProfile(false));
      const { data } = await postService.getAllPost();
      return data;
    },
    staleTime: Infinity,
    onSuccess(data) {
      dispatch(setAllPost(data.content));
      dispatch(setUser(data.content));
    },
    onError(err) {
      console.log(err);
    },
  });

  return {
    isLoading,
    isError,
    allPost: data?.content?.allPostArr,
    userInfo: data?.content?.userInfo,
    isFetching,
  };
};

const usePostsData = (userID: string) => {
  const dispatch = useDispatch();
  // const postArray = useSelector((state: any) => state.postReducer.postArr);
  // const userInfo = useSelector((state: any) => state.userReducer.userInfo);
  // const ownerInfo = useSelector((state: any) => state.postReducer.ownerInfo);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["posts", userID],
    queryFn: async () => {
      if (userID === "me") {
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
      dispatch(setPostArr(data.content));
      dispatch(setUser(data.content));
      dispatch(setOwnerInfo(data.content));
    },
    onError(err) {
      console.log(err);
    },
  });

  return {
    isLoading,
    isError,
    postArray: data?.content?.postArr,
    userInfo: data?.content?.userInfo,
    ownerInfo: data?.content?.ownerInfo,
    isFetching,
  };
};

const useConversationsData = () => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await messageService.getConversations();
      return data;
    },
  });

  return {
    isLoadingConversations: isLoading,
    isError,
    conversations: data?.content?.conversations,
    isFetching,
  };
};

const useCurrentConversationData = (conversationID: any) => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["conversation", conversationID],
    queryFn: async () => {
      const { data } = await messageService.getConversation(conversationID);
      return data;
    },
    enabled: !!conversationID,
  });

  return {
    isLoadingConversation: isLoading,
    isError,
    currentConversation: data?.content?.conversation,
    isFetching,
  };
};

const useFollowersData = (userID: string) => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["followers", userID],
    queryFn: async () => {
      const { data } = await userService.getFollowers();
      data.content.followers.forEach((follower: any) => {
        follower.username = follower.lastname + " " + follower.firstname;
      });
      dispatch(setUser(data.content));
      return data;
    },
    enabled: !!userID,
  });

  return {
    isLoadingFollowers: isLoading,
    isError,
    followers: data?.content?.followers,
    isFetching,
  };
};

const useMessagesData = (conversationID: any) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["messages", conversationID],
    queryFn: async () => {
      const { data } = await messageService.getMessages(conversationID);
      return data;
    },
    enabled: !!conversationID,
  });

  return {
    isLoadingMessages: isLoading,
    isError,
    messages: data?.content?.messages,
    isFetching,
    refetchMessages: refetch,
  };
};

export {
  useAllPostsData,
  usePostsData,
  useConversationsData,
  useFollowersData,
  useCurrentConversationData,
  useMessagesData,
};
