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

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { clientPresence } from './presence.connect';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { setFollowers, setMembers } from '@/redux/Slice/ActiveListSlice';

const SET_PRESENCE = 'SET_PRESENCE';
const SET_ACTIVE_MEM = 'SET_ACTIVE_MEM';

const PresenceService = () => {
  const { currentUserInfo } = useCurrentUserInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      clientPresence.on('connect', () => {
        console.log('connected presenceService');
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (currentUserInfo) {
      clientPresence.emit(SET_PRESENCE, currentUserInfo._id);

      clientPresence.on(SET_ACTIVE_MEM, (data: any) => {
        const followers = currentUserInfo.followers.map(
          followes => followes._id
        );

        const intersection = followers.filter(follower =>
          data.includes(follower)
        );
        intersection.push(currentUserInfo._id);

        dispatch(setMembers(intersection));

        console.log('data::', data);
      });
    }
  }, [currentUserInfo]);

  return <></>;
};

export default PresenceService;
