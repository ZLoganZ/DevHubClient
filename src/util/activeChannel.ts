import { useEffect } from 'react';

import { setMembers } from '@/redux/Slice/SocketSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/special';

const SET_PRESENCE = 'SET_PRESENCE';
const SET_ACTIVE_MEM = 'SET_ACTIVE_MEM';

const ActiveChannel = () => {
  const dispatch = useAppDispatch();
  const { members, presenceSocket } = useAppSelector((state) => state.socketIO);

  const user = useAppSelector((state) => state.auth.userID);

  useEffect(() => {
    if (!user) return;

    presenceSocket.on(SET_ACTIVE_MEM, (data: string[]) => {
      dispatch(setMembers(data));
    });

    presenceSocket.emit(SET_PRESENCE, user);

    return () => {
      presenceSocket.off(SET_ACTIVE_MEM);
      presenceSocket.off(SET_PRESENCE);
    };
  }, [presenceSocket, setMembers, user, members]);
};

export default ActiveChannel;
