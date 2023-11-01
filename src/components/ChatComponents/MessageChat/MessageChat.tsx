import { Col, Row } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { debounce } from 'lodash';

import { getTheme } from '@/util/theme';
import { IS_TYPING, SEEN_MSG, STOP_TYPING } from '@/util/constants/SettingSystem';
import { useOtherUser, useAppSelector, useIntersectionObserver } from '@/hooks/special';
import { useCurrentConversationData, useCurrentUserInfo, useMessagesData } from '@/hooks/fetch';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import MessageBox from '@/components/ChatComponents/MessageBox';
import ChatInput from '@/components/ChatComponents/InputChat/InputChat';
import ConversationOption from '@/components/ChatComponents/ConversationOption';
import ChatWelcome from '@/components/ChatComponents/ChatWelcome';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import { MessageType } from '@/types';
import getImageURL from '@/util/getImageURL';
import audioCall from '@/util/audioCall';
import videoChat from '@/util/videoChat';
import { getLastOnline } from '@/util/formatDateTime';
import StyleProvider from './cssMessageChat';
import { commonColor } from '@/util/cssVariable';

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
  const { messages, isLoadingMessages, fetchPreviousMessages, isFetchingPreviousPage, hasPreviousMessages } =
    useMessagesData(conversationID);

  const otherUser = useOtherUser(currentConversation);

  const [count, setCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const activeUser = members.find((member) => member._id === otherUser._id);
  console.log('activeUser', activeUser)

  const [displayOption, setDisplayOption] = useState(false);

  const statusText = useMemo(() => {
    if (currentConversation.type === 'group') {
      const membersActive = currentConversation.members.filter(
        (member) =>
          member._id === currentUserInfo._id ||
          members.some((user) => user._id === member._id && user.is_online)
      );

      const memberCount = currentConversation.members.length;
      const activeMemberCount = membersActive.length;

      return `${memberCount} members - ${activeMemberCount === 1 ? 'Only you' : activeMemberCount} online`;
    }

    const lastOnline =
      !activeUser?.first_online || !activeUser ? otherUser.last_online : activeUser.last_online;

    return activeUser?.is_online ? 'Online' : getLastOnline(lastOnline);
  }, [currentConversation, activeUser, members]);

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
    if (!isFetchingPreviousPage && messages && messages.length >= 20) void fetchPreviousMessages();
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

  const setTyping = useCallback(
    debounce((data: string) => setTypingUsers((prev) => prev.filter((user) => user !== data)), 500),
    []
  );

  useEffect(() => {
    if (!messages) return;
    if (count === 0) scrollToBottom('instant');
    if (messages.length - count === 1) scrollToBottom('auto');
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
      setTyping(data);
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
  }, [typingUsers, currentUserInfo, isTyping]);

  const styleStatus = useMemo(() => {
    return activeUser?.is_online ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [activeUser, themeColorSet]);

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

  const isMoreThan10Min = useCallback((message: MessageType, index: number, messArr: MessageType[]) => {
    if (index === 0) return true;
    if (!messArr) return false;

    return new Date(message.createdAt).getTime() - new Date(messArr[index - 1].createdAt).getTime() > 600000;
  }, []);

  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
      {isLoadingMessages ? (
        <LoadingConversation />
      ) : (
        <Row className='h-full'>
          <Col span={displayOption ? 16 : 24} className='h-full'>
            <div
              className='header flex justify-between items-center py-4 px-6'
              style={{
                height: '10%',
                boxShadow: '5px 1px 10px' + themeColorSet.colorBg2
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
                  <div className='font-semibold' style={{ color: themeColorSet.colorText1 }}>
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

              <div className='flex items-center justify-center gap-5'>
                <FontAwesomeIcon
                  onClick={() => audioCall(conversationID)}
                  className='audio-call text-lg cursor-pointer'
                  icon={faPhone}
                  style={{ color: commonColor.colorBlue1 }}
                />
                <FontAwesomeIcon
                  onClick={() => videoChat(conversationID)}
                  className='video-call text-xl cursor-pointer'
                  icon={faVideoCamera}
                  style={{ color: commonColor.colorBlue1 }}
                />
                <FontAwesomeIcon
                  className='display-share text-xl cursor-pointer'
                  icon={faCircleInfo}
                  onClick={() => setDisplayOption(!displayOption)}
                  style={{ color: commonColor.colorBlue1 }}
                />
              </div>
            </div>
            <div
              style={{
                height: '90%',
                overflow: 'auto',
                backgroundImage: `url(${getImageURL(currentConversation.cover_image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
              <div
                className='body'
                style={{
                  height: '92%',
                  overflow: 'auto'
                }}>
                <div
                  className=''
                  style={{
                    // backgroundColor: 'rgba(0,0,0,0.5)',
                    backgroundColor: `rgba(${themeColorSet.colorBg1}, ${themeColorSet.colorBg1}, ${themeColorSet.colorBg1}, 0.5)`
                  }}>
                  <div className='flex-1 overflow-y-hidden'>
                    {!hasPreviousMessages && (
                      <ChatWelcome
                        type={currentConversation.type}
                        name={currentConversation.name}
                        members={currentConversation.members}
                        otherUser={otherUser}
                        image={currentConversation.image}
                      />
                    )}
                    <div className='pt-1' ref={topRef} />
                    {messages.map((message, index, messArr) => (
                      <MessageBox
                        key={`${conversationID}-${message._id}`}
                        type={currentConversation.type}
                        isLastMes={index === messages.length - 1}
                        message={message}
                        seen={currentConversation.seen}
                        isPrevMesGroup={isPrevMesGroup(message, index, messArr)}
                        isNextMesGroup={isNextMesGroup(message, index, messArr)}
                        isMoreThan10Min={isMoreThan10Min(message, index, messArr)}
                        isAdmin={
                          currentConversation.admins &&
                          currentConversation.admins.some((admin) => admin._id === message.sender._id)
                        }
                      />
                    ))}
                    <div className='pb-1' ref={bottomRef} />
                  </div>
                </div>
              </div>
              <div className='px-2 flex flex-row items-center opacity-0' ref={typingDiv}>
                {currentConversation.members.map((member) => {
                  const index = typingUsers.findIndex((user) => user === member._id);
                  if (index !== -1) {
                    return (
                      <img
                        key={member._id}
                        className='rounded-full top-3 absolute h-6 w-6 overflow-hidden'
                        src={getImageURL(member.user_image, 'avatar_mini')}
                        style={{
                          left: `${index * 30 + typingUsers.length * 10}px`,
                          border: `2px solid ${themeColorSet.colorBg4}`
                        }}
                      />
                    );
                  }
                  return null;
                })}
                <div
                  className='typing-indicator rounded-full'
                  style={{
                    backgroundColor: themeColorSet.colorBg4,
                    left: `${typingUsers.length * 30 + typingUsers.length * 10}px`
                  }}>
                  <div /> <div /> <div />
                </div>
              </div>
              <ChatInput conversationID={conversationID} />
            </div>
          </Col>
          {displayOption && (
            <Col span={8} className='h-full'>
              <ConversationOption conversationID={conversationID} />
            </Col>
          )}
        </Row>
      )}
    </StyleProvider>
  );
};

export default MessageChat;
