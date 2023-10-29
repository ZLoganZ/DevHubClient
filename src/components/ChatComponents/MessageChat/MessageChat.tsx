import { Col, Row, Space } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/theme';
import { IS_TYPING, SEEN_MSG, STOP_TYPING } from '@/util/constants/SettingSystem';
import { useOtherUser, useAppSelector, useIntersectionObserver } from '@/hooks/special';
import { useCurrentConversationData, useCurrentUserInfo, useMessagesData } from '@/hooks/fetch';
import Avatar from '@/components/Avatar/AvatarMessage';
import MessageBox from '@/components/ChatComponents/MessageBox';
import InputChat from '@/components/ChatComponents/InputChat/InputChat';
import SharedMedia from '@/components/ChatComponents/SharedMedia';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import { MessageType } from '@/types';
import getImageURL from '@/util/getImageURL';
import StyleProvider from './cssMessageChat';

interface IParams {
  conversationID: string;
}

const MessageChat: React.FC<IParams> = ({ conversationID }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  const { members, chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();
  const { currentConversation } = useCurrentConversationData(conversationID);
  const { messages, isLoadingMessages, fetchPreviousMessages, isFetchingPreviousPage } =
    useMessagesData(conversationID);

  const otherUser = useOtherUser(currentConversation);

  const [count, setCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const isActive = members.some((memberID) => memberID === otherUser._id);

  const [isDisplayShare, setIsDisplayShare] = useState(false);

  const statusText = useMemo(() => {
    if (currentConversation.type === 'group') return `${currentConversation.members.length} members`;

    return isActive ? 'Online' : 'Offline';
  }, [currentConversation, isActive]);

  const seenMessage = useCallback(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender._id !== currentUserInfo._id &&
      !currentConversation.seen.some((user) => user._id === currentUserInfo._id)
    ) {
      chatSocket.emit(SEEN_MSG, {
        conversationID,
        userID: currentUserInfo._id
      });
    }
  }, [currentConversation.seen, conversationID, messages]);

  const fetchPreMessages = useCallback(() => {
    if (!isFetchingPreviousPage && messages && messages.length >= 20) fetchPreviousMessages();
  }, [isFetchingPreviousPage, messages]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const typingDiv = useRef<HTMLDivElement>(null);

  useIntersectionObserver(bottomRef, seenMessage);
  useIntersectionObserver(topRef, fetchPreMessages);

  const scrollToBottom = useCallback(
    (type: ScrollBehavior) => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: type, block: 'end' });
    },
    [bottomRef.current]
  );

  useEffect(() => {
    if (!messages) return;
    if (count === 0) scrollToBottom('instant');
    if (messages.length - count === 1) scrollToBottom('smooth');
    setCount(messages.length);
  }, [messages]);

  useEffect(() => {
    chatSocket.on(IS_TYPING + conversationID, (data: string) => {
      setTypingUsers((prev) =>
        prev.some((user) => user === data) || data === currentUserInfo._id ? prev : [...prev, data]
      );
      setIsTyping(true);
    });
    chatSocket.on(STOP_TYPING + conversationID, (data: string) => {
      setIsTyping(typingUsers.length !== 1);
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((user) => user !== data));
      }, 500);
    });

    if (typingDiv.current) {
      typingDiv.current.style.transition = '0.4s';
      if (typingUsers.length === 0 || !isTyping) {
        typingDiv.current.style.opacity = '0';
        typingDiv.current.style.transform = 'translateY(0)';
      } else {
        typingDiv.current.style.opacity = '1';
        typingDiv.current.style.transform = 'translateY(-2rem)';
      }
    }

    return () => {
      chatSocket.off(IS_TYPING + conversationID);
      chatSocket.off(STOP_TYPING + conversationID);
    };
  }, [typingUsers.length, currentUserInfo, isTyping]);

  const styleStatus = useMemo(() => {
    return isActive ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [isActive, themeColorSet]);

  const isPrevMesGroup = useCallback((message: MessageType, index: number, messArr: MessageType[]) => {
    if (index === 0) return false;
    if (!messArr) return false;

    const isSameSender = message.sender._id === messArr[index - 1].sender._id;
    if (!isSameSender) return false;

    return new Date(message.createdAt).getTime() - new Date(messArr[index - 1].createdAt).getTime() < 60000;
  }, []);

  const isNextMesGroup = useCallback((message: MessageType, index: number, messArr: MessageType[]) => {
    if (index === messArr.length - 1) return false;
    if (!messArr) return false;

    const isSameSender = message.sender._id === messArr[index + 1].sender._id;
    if (!isSameSender) return false;

    return new Date(messArr[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime() < 60000;
  }, []);

  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
      {isLoadingMessages ? (
        <LoadingConversation />
      ) : (
        <Row className='h-full'>
          <Col span={true ? 16 : 24} className='h-full'>
            <div
              className='header flex justify-between items-center py-6 px-6'
              style={{
                height: '13%'
              }}>
              <div className='flex gap-3 items-center'>
                {currentConversation.type === 'group' ? (
                  <AvatarGroup
                    key={currentConversation._id}
                    users={currentConversation.members}
                    image={currentConversation.image}
                  />
                ) : (
                  <NavLink to={`/user/${otherUser._id}`}>
                    <Avatar key={otherUser._id} user={otherUser} />
                  </NavLink>
                )}
                <div className='flex flex-col'>
                  <div style={{ color: themeColorSet.colorText1 }}>
                    {currentConversation.name ?? (
                      <NavLink to={`/user/${otherUser._id}`}>{otherUser.name}</NavLink>
                    )}
                  </div>
                  <div
                    className='text-sm'
                    style={{
                      color: styleStatus,
                      fontWeight: 400
                    }}>
                    {statusText}
                  </div>
                </div>
              </div>
              <Space align='center' size={20} className='flex gap-3'>
                <div
                  className='call p-1'
                  onClick={async () => {
                    const width = window.screen.width / 2; // Width of the pop-up window
                    const height = window.screen.height / 2; // Height of the pop-up window
                    const left = window.screen.width / 2 - width / 2;
                    const top = window.screen.height / 2 - height / 2;
                    window.open(
                      `/call/${conversationID}/voice`,
                      'audioCall',
                      `width=${width},height=${height},top=${top},left=${left}`
                    );
                  }}>
                  <FontAwesomeIcon className='text-lg cursor-pointer' icon={faPhone} />
                </div>
                <div
                  className='call p-1'
                  onClick={async () => {
                    const width = window.screen.width / 2; // Width of the pop-up window
                    const height = window.screen.height / 2; // Height of the pop-up window
                    const left = window.screen.width / 2 - width / 2;
                    const top = window.screen.height / 2 - height / 2;
                    window.open(
                      `/call/${conversationID}/video`,
                      'videoCall',
                      `width=${width},height=${height},top=${top},left=${left}`
                    );
                  }}>
                  <FontAwesomeIcon className='text-xl cursor-pointer' icon={faVideoCamera} />
                </div>
                <div className='displayShare ml-4 p-1'>
                  <FontAwesomeIcon
                    className='text-xl cursor-pointer'
                    icon={faCircleInfo}
                    onClick={() => {
                      setIsDisplayShare(!isDisplayShare);
                    }}
                  />
                </div>
              </Space>
            </div>
            <div
              className='body px-3'
              style={{
                height: '89%',
                overflow: 'auto'
              }}>
              <div className='flex-1 overflow-y-hidden'>
                <div className='pt-1' ref={topRef} />
                {messages.map((message, index, messArr) => (
                  <MessageBox
                    key={`${conversationID}-${message._id}`}
                    isLastMes={index === messages.length - 1}
                    message={message}
                    seen={currentConversation.seen}
                    isPrevMesGroup={isPrevMesGroup(message, index, messArr)}
                    isNextMesGroup={isNextMesGroup(message, index, messArr)}
                  />
                ))}
                <div className='pb-1' ref={bottomRef} />
              </div>
            </div>
            <div className='px-2 flex flex-row items-center opacity-0' ref={typingDiv}>
              {currentConversation.members.map((member) => {
                const index = typingUsers.findIndex((user) => user === member._id);
                if (index !== -1) {
                  return (
                    <img
                      key={member._id}
                      className={`rounded-full top-3 left-${
                        index * 8 + typingUsers.length * 1
                      } absolute h-6 w-6 overflow-hidden`}
                      src={getImageURL(member.user_image, 'avatar_mini')}
                    />
                  );
                }
                return null;
              })}
              <div
                className={`typing-indicator rounded-full left-${
                  typingUsers.length * 8 + typingUsers.length * 2
                }`}
                style={{ backgroundColor: themeColorSet.colorBg4 }}>
                <div /> <div /> <div />
              </div>
            </div>
            <InputChat conversationID={conversationID} />
          </Col>
          {true && (
            <Col span={8}>
              <SharedMedia conversationID={conversationID!} />
            </Col>
          )}
        </Row>
      )}
    </StyleProvider>
  );
};

export default MessageChat;
