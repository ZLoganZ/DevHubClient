import { Dropdown, MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBellSlash,
  faPhone,
  faRightFromBracket,
  faSquareCheck,
  faTrashCan,
  faUser,
  faVideoCamera
} from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck as faReSquareCheck } from '@fortawesome/free-regular-svg-icons';

import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import videoChat from '@/util/videoChat';
import audioCall from '@/util/audioCall';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { useLeaveGroup, useReceiveMessage, useReceiveSeenConversation } from '@/hooks/mutation';
import { ConversationType, MessageType } from '@/types';
import { PRIVATE_MSG, SEEN_MSG, UNSEEN_MSG } from '@/util/constants/SettingSystem';

import StyleProvider from './cssConversationBox';

interface ConversationBoxProps {
  conversation: ConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
  useAppSelector((state) => state.theme.change);
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { themeColorSet } = getTheme();

  const navigate = useNavigate();

  const otherUser = useOtherUser(conversation);
  const { currentUserInfo } = useCurrentUserInfo();
  const { mutateReceiveSeenConversation } = useReceiveSeenConversation();
  const { mutateReceiveMessage } = useReceiveMessage();
  const { mutateLeaveGroup } = useLeaveGroup();

  const items: MenuProps['items'] = [
    {
      label: conversation.seen.some((user) => user._id === currentUserInfo._id)
        ? 'Undo reading'
        : 'Mark as read',
      style: {
        display:
          !!!conversation.lastMessage || conversation.lastMessage.sender._id === currentUserInfo._id
            ? 'none'
            : 'block'
      },
      key: '1',
      icon: conversation.seen.some((user) => user._id === currentUserInfo._id) ? (
        <FontAwesomeIcon icon={faReSquareCheck} />
      ) : (
        <FontAwesomeIcon icon={faSquareCheck} />
      ),
      onClick: () => {
        !conversation.seen.some((user) => user._id === currentUserInfo._id)
          ? chatSocket.emit(SEEN_MSG, {
              conversationID: conversation._id,
              userID: currentUserInfo._id
            })
          : chatSocket.emit(UNSEEN_MSG, {
              conversationID: conversation._id,
              userID: currentUserInfo._id
            });
      }
    },
    {
      label: 'Mute notifications',
      key: '2',
      icon: <FontAwesomeIcon icon={faBellSlash} />
    },
    {
      label: 'View profile',
      key: '4',
      icon: <FontAwesomeIcon icon={faUser} />,
      onClick: () => {
        navigate(`/user/${otherUser._id}`);
      },
      style: {
        display: conversation.type === 'group' ? 'none' : 'block'
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Audio call',
      key: '5',
      icon: <FontAwesomeIcon icon={faPhone} />,
      onClick: () => audioCall(conversation._id)
    },
    {
      label: 'Video chat',
      key: '6',
      icon: <FontAwesomeIcon icon={faVideoCamera} />,
      onClick: () => videoChat(conversation._id)
    },
    {
      type: 'divider'
    },
    {
      label: conversation.type === 'group' ? 'Leave group' : 'Delete chat',
      danger: true,
      key: '3',
      onClick: () => {
        mutateLeaveGroup(conversation._id);
      },
      icon:
        conversation.type === 'group' ? (
          <FontAwesomeIcon icon={faRightFromBracket} />
        ) : (
          <FontAwesomeIcon icon={faTrashCan} />
        )
    }
  ];

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
  const [isShowTime, setIsShowTime] = useState(getDateTimeToNow(conversation.lastMessage?.createdAt));

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setIsShowTime(getDateTimeToNow(conversation.lastMessage?.createdAt));
    }, 60000);

    return () => clearInterval(timeoutId);
  }, []);

  return (
    <StyleProvider theme={themeColorSet}>
      <Dropdown menu={{ items }} trigger={['contextMenu']}>
        <NavLink to={`/message/${conversation._id}`}>
          <div
            className='conversation-box w-full relative flex items-center space-x-3 my-3 p-3  transition'
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
