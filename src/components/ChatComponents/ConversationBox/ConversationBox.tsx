import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { ConversationType, MessageType, UserInfoType } from '@/types';
import { PRIVATE_MSG, SEEN_MSG } from '@/util/constants/SettingSystem';

import StyleProvider from './cssConversationBox';

interface ConversationBoxProps {
  conversation: ConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
  useAppSelector((state) => state.theme.change);
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { themeColorSet } = getTheme();

  const queryClient = useQueryClient();

  const otherUser = useOtherUser(conversation);
  const { currentUserInfo } = useCurrentUserInfo();

  const isOwn = useMemo(() => {
    return currentUserInfo._id === conversation.lastMessage?.sender?._id ?? false;
  }, [conversation.lastMessage]);

  const senderName = useMemo(() => {
    if (isOwn) return 'You: ';

    if (conversation.type === 'private') return '';

    const lastMessageSenderName = conversation.lastMessage?.sender?.name;
    if (!lastMessageSenderName) return '';

    const arr = lastMessageSenderName.split(' ');
    return arr[arr.length - 1] + ': ';
  }, [isOwn, conversation.lastMessage?.sender?.name, conversation.type]);

  const userID = useMemo(() => {
    return currentUserInfo._id;
  }, [currentUserInfo]);

  const [seenArr, setSeenArr] = useState<UserInfoType[]>(conversation.seen);

  useEffect(() => {
    chatSocket.on(PRIVATE_MSG + conversation._id, (message: MessageType) => {
      setSeenArr([]);
      queryClient.setQueryData<ConversationType[]>(['conversations'], (oldData) => {
        if (!oldData) return [{ ...conversation, lastMessage: message }];

        const index = oldData.findIndex((item) => item._id === conversation._id);
        if (index !== -1) {
          oldData[index].lastMessage = message;
          oldData[index].seen = [];
        } else {
          oldData.unshift({ ...conversation, lastMessage: message });
        }

        return [...oldData];
      });
    });

    chatSocket.on(SEEN_MSG + conversation._id, (conversation: ConversationType) => {
      queryClient.setQueryData<ConversationType[]>(['conversations'], (oldData) => {
        if (!oldData) return [conversation];

        const index = oldData.findIndex((item) => item._id === conversation._id);
        if (index !== -1) {
          oldData[index].seen = conversation.seen;
        }

        return [...oldData];
      });
      setSeenArr(conversation.seen);
    });
  }, []);

  const hasSeen = useMemo(() => {
    if (!conversation.lastMessage) return false;

    return seenArr.some((user) => user._id === userID);
  }, [conversation.lastMessage, seenArr]);

  const lastMessageText = useMemo(() => {
    if (conversation.lastMessage?.image) return 'Sent an image';

    if (conversation.lastMessage?.content) return conversation.lastMessage.content;

    return 'Start a conversation';
  }, [conversation.lastMessage, userID]);

  return (
    <StyleProvider theme={themeColorSet}>
      <div
        className='conversation-box w-full relative flex items-center space-x-3 my-3 p-3 rounded-lg transition'
        style={{
          backgroundColor: selected ? themeColorSet.colorBg2 : themeColorSet.colorBg1
        }}>
        {conversation.type === 'group' ? (
          <AvatarGroup key={conversation._id} users={conversation.members} image={conversation.image} />
        ) : (
          <Avatar key={conversation._id} user={otherUser} />
        )}

        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <span className='absolute inset-0' aria-hidden='true' />
            <div className='flex justify-between items-center mb-1'>
              <p
                className={`text-md font-medium`}
                style={{
                  color: themeColorSet.colorText1
                }}>
                <span style={{ color: themeColorSet.colorText1 }}>{conversation.name ?? otherUser.name}</span>
              </p>
              {conversation.lastMessage?.createdAt && (
                <p className=' text-xs  text-gray-400 font-light' style={{ color: themeColorSet.colorText3 }}>
                  {formatDateTime(conversation.lastMessage?.createdAt)}
                </p>
              )}
            </div>
            <p className={`truncate text-sm ${!isOwn && !hasSeen && `font-bold`}`}>
              <span style={{ color: themeColorSet.colorText1 }}>{senderName + lastMessageText}</span>
            </p>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default ConversationBox;
