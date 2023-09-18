import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Channel, Members } from 'pusher-js';

import { pusherClient } from './Pusher';
import {
  setMembers,
  addMember,
  removeMember
} from '@/redux/Slice/ActiveListSlice';
import { AppDispatch, RootState } from '@/redux/configStore';

const ActiveChannel = () => {
  const dispatch = useAppDispatch();
  const { members } = useSelector(
    (state: RootState) => state.activeListReducer
  );

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const login = useAppSelector((state) => state.authReducer.login);

  useEffect(() => {
    if (!login) return;
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('presence-user');
      setActiveChannel(channel);
    }

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: String[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      dispatch(setMembers(initialMembers));
    });

    channel.bind('pusher:member_added', (member: Record<string, any>) =>
      dispatch(addMember(member.id))
    );

    channel.bind('pusher:member_removed', (member: Record<string, any>) =>
      dispatch(removeMember(member.id))
    );

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-user');
        setActiveChannel(null);
      }
    };
  }, [activeChannel, addMember, setMembers, removeMember, login]);
};

export default ActiveChannel;
