// import { clientPresence } from './presence.connect';

// const SET_PRESENCE = 'SET_PRESENCE'

// class PresenceService {
//   constructor() {
//     this.listen();
//   }
//   async listen() {
//     try {
//       clientPresence.on('connect', () => {
//         console.log('connected presenceService');
//       });
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
//   async setPresence(userId: String) {
//     try {
//       clientPresence.emit(SET_PRESENCE, userId);
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
// }

// export default PresenceService;

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

      const followers = currentUserInfo.followers.map((follower) => follower._id);
      const following = currentUserInfo.following.map((following) => following._id);

      // Combine followers, following and remove duplicate
      const members = [...followers, ...following].filter((item, index, arr) => arr.indexOf(item) === index);

      presenceSocket.on(SET_ACTIVE_MEM, (data: string[]) => {
        const activeMembers = members.filter((member) => data.includes(member));
        activeMembers.push(currentUserInfo._id);

        dispatch(setMembers(activeMembers));
      });
    }
  }, [currentUserInfo]);

  return <></>;
};

export default PresenceService;
