import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { setMembers } from '@/redux/Slice/SocketSlice';

const SET_PRESENCE = 'SET_PRESENCE';
const SET_ACTIVE_MEM = 'SET_ACTIVE_MEM';

const PresenceService = () => {
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
        first_online: 0,
        is_online: false
      }));
      const following = currentUserInfo.following.map((following) => ({
        _id: following._id,
        last_online: following.last_online,
        first_online: 0,
        is_online: false
      }));

      // Combine followers, following and remove duplicate
      const members = [...followers, ...following].filter((item, index, arr) => arr.indexOf(item) === index);

      presenceSocket.on(SET_ACTIVE_MEM, (data: string[]) => {
        const activeMembers = members.map((member) => {
          if (data.includes(member._id)) {
            return { ...member, isActive: true, first_online: member.first_online + 1, is_online: true };
          }
          return { ...member, isActive: false, last_online: Date.now(), is_online: false };
        });

        dispatch(setMembers(activeMembers));
      });
    }
  }, [currentUserInfo]);

  return <></>;
};

export default PresenceService;
