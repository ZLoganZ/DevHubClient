import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/theme';
import { SEEN_MSG } from '@/util/constants/SettingSystem';
import { useIntersectionObserver, useOtherUser } from '@/hooks/special';
import { useCurrentConversationData, useCurrentUserInfo, useMessagesData } from '@/hooks/fetch';
import { useAppSelector } from '@/hooks/special';
import Avatar from '@/components/Avatar/AvatarMessage';
import MessageBox from '@/components/ChatComponents/MessageBox';
import InputChat from '@/components/ChatComponents/InputChat/InputChat';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import { ConversationType, MessageType, UserInfoType } from '@/types';
import StyleProvider from './cssMessageChat';

interface IParams {
  conversationID: string;
  setIsDisplayShare: (isDisplayShare: boolean) => void;
  isDisplayShare: boolean;
}

const MessageChat: React.FC<IParams> = ({ conversationID, isDisplayShare, setIsDisplayShare }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { members, chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();

  const { currentConversation } = useCurrentConversationData(conversationID);

  const { messages, isLoadingMessages } = useMessagesData(conversationID);

  const otherUser = useOtherUser(currentConversation);

  const [count, setCount] = useState(0);

  const isActive = members?.indexOf(otherUser?._id) !== -1;

  const statusText = useMemo(() => {
    if (currentConversation.type === 'group') {
      return `${currentConversation.members.length} members`;
    }

    return isActive ? 'Online' : 'Offline';
  }, [currentConversation, isActive]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [messagesState, setMessagesState] = useState<MessageType[]>([]);
  const [seenState, setSeenState] = useState<UserInfoType[]>(currentConversation.seen);

  useEffect(() => {
    if (conversationID && currentUserInfo) {
      chatSocket.on(SEEN_MSG + conversationID, (data: ConversationType) => {
        setSeenState(data.seen);
      });
    }
  }, [conversationID, currentUserInfo, messagesState, seenState]);

  const seenMessage = useCallback(() => {
    if (seenState.some((user) => user._id === currentUserInfo._id)) return;

    chatSocket.emit(SEEN_MSG, {
      conversationID,
      userID: currentUserInfo._id
    });
  }, [seenState, currentUserInfo, conversationID]);

  useEffect(() => {
    if (isLoadingMessages || !messages) return;
    setMessagesState(messages);
  }, [isLoadingMessages, messages]);

  useIntersectionObserver(bottomRef, seenMessage, { delay: 0, threshold: 0 });

  const scrollToBottom = (type: ScrollBehavior) => {
    if (bottomRef?.current) bottomRef?.current?.scrollIntoView({ behavior: type, block: 'end' });
  };

  useEffect(() => {
    if (messagesState.length === 0) return;
    if (count > 0) scrollToBottom('smooth');
    if (count === 0) scrollToBottom('auto');
    setCount(count + 1);
  }, [messagesState.length]);

  const styleStatus = useMemo(() => {
    return isActive ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [isActive]);

  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
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
              {currentConversation.name || <NavLink to={`/user/${otherUser._id}`}>{otherUser.name}</NavLink>}
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
          {messagesState.length !== 0 &&
            messagesState.map((message, i) => (
              <MessageBox
                key={message._id}
                isLast={i === messagesState.length - 1}
                message={message}
                seen={seenState}
              />
            ))}
          <div className='pt-1' ref={bottomRef} />
        </div>
      </div>
      <InputChat
        conversationID={conversationID}
        messagesState={messagesState}
        setMessagesState={setMessagesState}
        setSeenState={setSeenState}
      />
    </StyleProvider>
  );
};

export default MessageChat;
