import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/theme';
import { PRIVATE_MSG, SEEN_MSG } from '@/util/constants/SettingSystem';
import { useIntersectionObserver, useOtherUser, useAppSelector } from '@/hooks/special';
import { useCurrentConversationData, useCurrentUserInfo, useMessagesData } from '@/hooks/fetch';
import Avatar from '@/components/Avatar/AvatarMessage';
import MessageBox from '@/components/ChatComponents/MessageBox';
import InputChat from '@/components/ChatComponents/InputChat/InputChat';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import { ConversationType, MessageType, UserInfoType } from '@/types';
import StyleProvider from './cssMessageChat';

interface IParams {
  conversationID: string;
  isDisplayShare: boolean;
  setIsDisplayShare: React.Dispatch<React.SetStateAction<boolean>>;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
}

const MessageChat: React.FC<IParams> = ({
  conversationID,
  isDisplayShare,
  setIsDisplayShare,
  setConversations
}) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  const { members, chatSocket } = useAppSelector((state) => state.socketIO);

  const queryClient = useQueryClient();

  const { currentUserInfo } = useCurrentUserInfo();
  const { currentConversation } = useCurrentConversationData(conversationID);
  const { messages, isLoadingMessages, fetchPreviousMessages } = useMessagesData(conversationID);
  console.log(messages);
  const otherUser = useOtherUser(currentConversation);

  const [count, setCount] = useState(0);

  const isActive = members.some((memberID) => memberID === otherUser._id);

  const statusText = useMemo(() => {
    if (currentConversation.type === 'group') return `${currentConversation.members.length} members`;

    return isActive ? 'Online' : 'Offline';
  }, [currentConversation, isActive]);

  const [seenState, setSeenState] = useState<UserInfoType[]>(currentConversation.seen);

  useEffect(() => {
    if (conversationID && currentUserInfo) {
      chatSocket.on(SEEN_MSG + conversationID, (data: ConversationType) => {
        queryClient.setQueryData<ConversationType>(['conversation', conversationID], (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            seen: data.seen
          };
        });
        setSeenState(data.seen);
      });

      chatSocket.on(PRIVATE_MSG + conversationID, (data: MessageType) => {
        queryClient.setQueryData<InfiniteData<MessageType[], number>>(
          ['messages', conversationID],
          (messages) => {
            if (!messages) return { pages: [[data]], pageParams: [0] };

            const index = messages.pages.findIndex((page) =>
              page.some((message) => message._id === data._id)
            );

            if (index !== -1) {
              const updatedMessages = messages.pages[index].map((message) => {
                if (message._id === data._id) {
                  return {
                    ...message,
                    isSending: false
                  };
                }
                return message;
              });

              const newPages = [...messages.pages];
              newPages[index] = updatedMessages;

              return { pages: newPages, pageParams: messages.pageParams };
            } else {
              return {
                pages: [[...messages.pages[messages.pages.length - 1], data]],
                pageParams: [...messages.pageParams]
              };
            }
          }
        );
      });
    }
  }, [conversationID, currentUserInfo]);

  const seenMessage = useCallback(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender._id !== currentUserInfo._id &&
      !seenState.some((user) => user._id === currentUserInfo._id)
    ) {
      chatSocket.emit(SEEN_MSG, {
        conversationID,
        userID: currentUserInfo._id
      });
    }
  }, [seenState, currentUserInfo, conversationID, messages]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(bottomRef, seenMessage, { delay: 0, threshold: 0 });

  const topRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(topRef, fetchPreviousMessages, { delay: 0, threshold: 0 });

  const scrollToBottom = (type: ScrollBehavior) => {
    if (bottomRef?.current) bottomRef.current.scrollIntoView({ behavior: type, block: 'end' });
  };

  useEffect(() => {
    if (!messages) return;
    if (count > 0) scrollToBottom('smooth');
    if (count === 0) scrollToBottom('auto');
    setCount(count + 1);
  }, [messages]);

  const styleStatus = useMemo(() => {
    return isActive ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [isActive, themeColorSet]);

  const isPrevMesGroup = useCallback(
    (message: MessageType, index: number) => {
      if (index === 0) return false;
      if (!messages) return false;

      const isSameSender = message.sender._id === messages[index - 1].sender._id;
      if (!isSameSender) return false;

      return (
        new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() < 60000
      );
    },
    [messages]
  );

  const isNextMesGroup = useCallback(
    (message: MessageType, index: number) => {
      if (index === messages.length - 1) return false;
      if (!messages) return false;

      const isSameSender = message.sender._id === messages[index + 1].sender._id;
      if (!isSameSender) return false;

      return (
        new Date(messages[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime() < 60000
      );
    },
    [messages]
  );

  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
      {isLoadingMessages ? (
        <LoadingConversation />
      ) : (
        <>
          <div
            className='header flex justify-between items-center py-6 px-6'
            style={{
              height: '13%',
              borderBottom: '1px solid',
              borderColor: themeColorSet.colorBg4
            }}>
            <div className='flex gap-3 items-center'>
              {currentConversation.type === 'group' ? (
                <AvatarGroup key={currentConversation._id} users={currentConversation.members} />
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
              {messages.map((message, i) => (
                <MessageBox
                  key={message._id}
                  isLastMes={i === messages.length - 1}
                  message={message}
                  seen={seenState}
                  isPrevMesGroup={isPrevMesGroup(message, i)}
                  isNextMesGroup={isNextMesGroup(message, i)}
                />
              ))}
              <div className='pb-1' ref={bottomRef} />
            </div>
          </div>
          <InputChat
            conversationID={conversationID}
            setSeenState={setSeenState}
            setConversations={setConversations}
          />
        </>
      )}
    </StyleProvider>
  );
};

export default MessageChat;
