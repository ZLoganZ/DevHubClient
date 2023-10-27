import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/theme';
import { SEEN_MSG } from '@/util/constants/SettingSystem';
import { useOtherUser, useAppSelector, useIntersectionObserver } from '@/hooks/special';
import { useCurrentConversationData, useCurrentUserInfo, useMessagesData } from '@/hooks/fetch';
import Avatar from '@/components/Avatar/AvatarMessage';
import MessageBox from '@/components/ChatComponents/MessageBox';
import InputChat from '@/components/ChatComponents/InputChat/InputChat';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import { MessageType } from '@/types';
import StyleProvider from './cssMessageChat';
import { Col, Row } from 'antd';
import SharedMedia from '../SharedMedia';

interface IParams {
  conversationID: string;
  isDisplayShare: boolean;
  setIsDisplayShare: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessageChat: React.FC<IParams> = ({ conversationID, isDisplayShare, setIsDisplayShare }) => {
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

  const isActive = members.some((memberID) => memberID === otherUser._id);

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

  const styleStatus = useMemo(() => {
    return isActive ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [isActive, themeColorSet]);

  const isPrevMesGroup = useCallback(
    (message: MessageType, index: number, preMessage: MessageType) => {
      if (index === 0) return false;
      if (!messages) return false;

      const isSameSender = message.sender._id === preMessage.sender._id;
      if (!isSameSender) return false;

      return new Date(message.createdAt).getTime() - new Date(preMessage.createdAt).getTime() < 60000;
    },
    [messages]
  );

  const isNextMesGroup = useCallback(
    (message: MessageType, index: number, nextMessage: MessageType) => {
      if (index === messages.length - 1) return false;
      if (!messages) return false;

      const isSameSender = message.sender._id === nextMessage.sender._id;
      if (!isSameSender) return false;

      return new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime() < 60000;
    },
    [messages]
  );

  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
      {isLoadingMessages ? (
        <LoadingConversation />
      ) : (
        <Row className='h-full'>
          <Col span={16}>
            <div
              className='header flex justify-between items-center py-6 px-6'
              style={{
                height: '13%',
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
                    {currentConversation.name || (
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
              <div className='displayShare'>
                <FontAwesomeIcon
                  className='text-xl mr-0 cursor-pointer'
                  icon={faBars}
                  onClick={() => {
                    setIsDisplayShare(!isDisplayShare);
                  }}
                />
              </div>
            </div>
            <div
              className='body px-3'
              style={{
                height: '88%',
                overflow: 'auto'
              }}>
              <div className='flex-1 overflow-y-hidden'>
                <div className='pt-1' ref={topRef} />
                {messages.map((message, i, mesArr) => (
                  <MessageBox
                    key={`${conversationID}-${message._id}`}
                    isLastMes={i === messages.length - 1}
                    message={message}
                    seen={currentConversation.seen}
                    isPrevMesGroup={isPrevMesGroup(message, i, mesArr[i - 1])}
                    isNextMesGroup={isNextMesGroup(message, i, mesArr[i + 1])}
                  />
                ))}
                <div className='pb-1' ref={bottomRef} />
              </div>
            </div>
            <InputChat conversationID={conversationID} />
          </Col>
          <Col span={8}>
            <SharedMedia conversationID={conversationID!} />
          </Col>
        </Row>
      )}
    </StyleProvider>
  );
};

export default MessageChat;
