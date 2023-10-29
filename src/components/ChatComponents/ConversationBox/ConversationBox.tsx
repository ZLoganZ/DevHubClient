import { Dropdown, MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { useReceiveMessage, useReceiveSeenConversation } from '@/hooks/mutation';
import { ConversationType, MessageType } from '@/types';
import { PRIVATE_MSG, SEEN_MSG } from '@/util/constants/SettingSystem';

import StyleProvider from './cssConversationBox';

interface ConversationBoxProps {
  conversation: ConversationType;
  selected?: boolean;
}

const items: MenuProps['items'] = [
  {
    label: 'Mark as unread',
    key: '2'
  },
  {
    label: 'Mute',
    key: '3'
  },
  {
    label: 'Delete chat',
    key: '4'
  }
];

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
  useAppSelector((state) => state.theme.change);
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { themeColorSet } = getTheme();

  const otherUser = useOtherUser(conversation);
  const { currentUserInfo } = useCurrentUserInfo();
  const { mutateReceiveSeenConversation } = useReceiveSeenConversation();
  const { mutateReceiveMessage } = useReceiveMessage();

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

  useEffect(() => {
    chatSocket.on(PRIVATE_MSG + conversation._id, (message: MessageType) => {
      mutateReceiveMessage(message);
    });

    chatSocket.on(SEEN_MSG + conversation._id, (conversation: ConversationType) => {
      mutateReceiveSeenConversation(conversation);
    });
  }, []);

  const hasSeen = useMemo(() => {
    if (!conversation.lastMessage) return false;

    return conversation.seen.some((user) => user._id === userID);
  }, [conversation.lastMessage, conversation.seen]);

  const lastMessageText = useMemo(() => {
    if (conversation.lastMessage?.image) return 'Sent an image';

    if (conversation.lastMessage?.content) return conversation.lastMessage.content;

    return 'Start a conversation';
  }, [conversation.lastMessage, userID]);
  const [isShowTime, setIsShowTime] = useState(formatDateTime(conversation.lastMessage?.createdAt));

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setIsShowTime(formatDateTime(conversation.lastMessage?.createdAt));
    }, 60000);

    return () => clearInterval(timeoutId);
  }, []);

  return (
    <StyleProvider theme={themeColorSet}>
      <Dropdown menu={{ items }} trigger={['contextMenu']}>
        <NavLink to={`/message/${conversation._id}`}>
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
                    <span style={{ color: themeColorSet.colorText1 }}>
                      {conversation.name ?? otherUser.name}
                    </span>
                  </p>
                  {conversation.lastMessage?.createdAt && (
                    <p
                      className=' text-xs  text-gray-400 font-light'
                      style={{ color: themeColorSet.colorText3 }}>
                      {isShowTime}
                    </p>
                  )}
                </div>
                <p className={`truncate text-sm ${!isOwn && !hasSeen && `font-bold`}`}>
                  <span style={{ color: themeColorSet.colorText1 }}>{senderName + lastMessageText}</span>
                </p>
              </div>
            </div>
          </div>
        </NavLink>
      </Dropdown>
    </StyleProvider>
  );
};

export default ConversationBox;
