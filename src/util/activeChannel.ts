import { useState, useEffect } from 'react';
import { Channel, Members } from 'pusher-js';

import { pusherClient } from './pusher';
import { setMembers, addMember, removeMember } from '@/redux/Slice/ActiveListSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/special';

const ActiveChannel = () => {
  const dispatch = useAppDispatch();
  useAppSelector((state) => state.activeList.members);

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const user = useAppSelector((state) => state.auth.userID);

  useEffect(() => {
    if (!user) return;
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('presence-user');
      setActiveChannel(channel);
    }

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: String[] = [];

      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      dispatch(setMembers(initialMembers));
    });

    channel.bind('pusher:member_added', (member: Record<string, any>) => dispatch(addMember(member.id)));

    channel.bind('pusher:member_removed', (member: Record<string, any>) => dispatch(removeMember(member.id)));

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-user');
        setActiveChannel(null);
      }
    };
  }, [activeChannel, addMember, setMembers, removeMember, user]);
};

export default ActiveChannel;
