import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { setMembers } from '@/redux/Slice/SocketSlice';
import { SETUP, SET_ACTIVE_MEM, SET_PRESENCE } from '@/util/constants/SettingSystem';

export const PresenceService = () => {
  const { currentUserInfo } = useCurrentUserInfo();
  const dispatch = useAppDispatch();

  const { presenceSocket } = useAppSelector((state) => state.socketIO);

  useEffect(() => {
    if (currentUserInfo) {
      presenceSocket.emit(SET_PRESENCE, currentUserInfo._id);

      currentUserInfo.members = [...currentUserInfo.followers, ...currentUserInfo.following].filter(
        (item, index, arr) => arr.findIndex((t) => t._id === item._id) === index
      );

      const followers = currentUserInfo.followers.map((follower) => ({
        _id: follower._id,
        last_online: follower.last_online,
        first_online: false,
        is_online: false
      }));
      const following = currentUserInfo.following.map((following) => ({
        _id: following._id,
        last_online: following.last_online,
        first_online: false,
        is_online: false
      }));

      // Combine followers, following and remove duplicate
      const members = [...followers, ...following].filter((item, index, arr) => arr.indexOf(item) === index);
      let activeMembers = [...members];
      activeMembers.push({
        _id: currentUserInfo._id,
        last_online: new Date().toUTCString(),
        first_online: true,
        is_online: true
      });

      presenceSocket.on(SET_ACTIVE_MEM, (data: string[]) => {
        activeMembers = activeMembers.map((member) => {
          if (data.includes(member._id)) {
            return { ...member, first_online: true, is_online: true };
          }
          return { ...member, last_online: new Date().toUTCString(), is_online: false };
        });

        dispatch(setMembers(activeMembers));
      });
    }
  }, [currentUserInfo?._id]);

  return <></>;
};

export const ChatService = () => {
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { userID } = useAppSelector((state) => state.auth);

  useEffect(() => {
    chatSocket.emit(SETUP, userID);
  }, [userID]);

  return <></>;
};
