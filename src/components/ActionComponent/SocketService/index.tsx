import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo, useGetAllUsersUsedToChatWith } from '@/hooks/fetch';
import { setActiveMembers } from '@/redux/Slice/SocketSlice';
import { AUTHORIZATION, Socket } from '@/util/constants/SettingSystem';

export const PresenceService = () => {
  if (!localStorage.getItem(AUTHORIZATION)) return <></>;

  const dispatch = useAppDispatch();
  const { currentUserInfo } = useCurrentUserInfo();
  const { allUsersUsedToChatWith } = useGetAllUsersUsedToChatWith();

  const { presenceSocket } = useAppSelector((state) => state.socketIO);

  useEffect(() => {
    if (currentUserInfo && allUsersUsedToChatWith) {
      presenceSocket.emit(Socket.SET_PRESENCE, currentUserInfo._id);
      
      currentUserInfo.members = [...currentUserInfo.friends, ...allUsersUsedToChatWith].filter(
        (item, index, arr) =>
          arr.findIndex((t) => t._id === item._id) === index && item._id !== currentUserInfo._id
      );

      const members = [...currentUserInfo.members].map((member) => ({
        _id: member._id,
        last_online: member.last_online,
        first_online: false,
        is_online: false
      }));

      members.push({
        _id: currentUserInfo._id,
        last_online: currentUserInfo.last_online,
        first_online: true,
        is_online: true
      });

      let membersArr = [...members];

      presenceSocket.on(Socket.SET_ACTIVE_MEM, (data: string[]) => {
        membersArr = [...membersArr].map((member) => {
          if (data.includes(member._id)) {
            return { ...member, first_online: true, is_online: true };
          }
          return { ...member, last_online: new Date().toUTCString(), is_online: false };
        });

        dispatch(setActiveMembers(membersArr));
      });
    }
  }, [currentUserInfo, allUsersUsedToChatWith]);

  return <></>;
};

export const ChatService = () => {
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { userID } = useAppSelector((state) => state.auth);

  useEffect(() => {
    chatSocket.emit(Socket.SETUP, userID);
  }, [userID]);

  return <></>;
};
