import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { find } from 'lodash';
import { NavLink } from 'react-router-dom';

import { pusherClient } from '@/util/functions/Pusher';
import { getTheme } from '@/util/functions/ThemeFunction';
import { useIntersectionObserverNow } from '@/hooks';
import { useOtherUser } from '@/hooks';
import { useCurrentConversationData, useMessagesData } from '@/hooks';
import { messageService } from '@/services/MessageService';
import Avatar from '@/components/Avatar/AvatarMessage';
import MessageBox from '@/components/ChatComponents/MessageBox';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import { useAppSelector } from '@/hooks';
import StyleTotal from './cssMessageChat';

interface IParams {
  conversationID: string;
  setIsDisplayShare: (isDisplayShare: boolean) => void;
  isDisplayShare: boolean;
}

const MessageChat = (Props: IParams) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const { members } = useAppSelector((state) => state.activeListReducer);

  const { currentConversation, isLoadingCurrentConversation } =
    useCurrentConversationData(Props.conversationID);

  const { messages, isLoadingMessages } = useMessagesData(Props.conversationID);

  const otherUser = useOtherUser(currentConversation);

  const [count, setCount] = useState(0);

  const isActive = members?.indexOf(otherUser?._id) !== -1;

  const statusText = useMemo(() => {
    if (currentConversation.isGroup) {
      return `${currentConversation.users.length} members`;
    }

    return isActive ? 'Online' : 'Offline';
  }, [currentConversation, isActive]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [messagesState, setMessagesState] = useState([]);

  const seenMessage = async () => {
    await messageService.seenMessage(Props.conversationID);
  };

  useEffect(() => {
    if (isLoadingMessages) return;
    setMessagesState(messages);
  }, [isLoadingMessages, messages]);

  useEffect(() => {
    pusherClient.subscribe(Props.conversationID);

    const messageHandler = async (message: any) => {
      seenMessage();

      setMessagesState((current: any) => {
        if (find(current, { _id: message._id })) {
          return current;
        }

        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: any) => {
      setMessagesState((current: any) =>
        current.map((currentMessage: any) => {
          if (currentMessage._id === newMessage._id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('new-message', messageHandler);
    pusherClient.bind('message-update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(Props.conversationID);
      pusherClient.unbind('new-message', messageHandler);
      pusherClient.unbind('message-update', updateMessageHandler);
    };
  }, [Props.conversationID]);

  useIntersectionObserverNow(bottomRef, seenMessage);

  const scrollToBottom = (type: ScrollBehavior) => {
    if (bottomRef?.current)
      bottomRef?.current?.scrollIntoView({ behavior: type, block: 'end' });
  };

  useEffect(() => {
    if (messagesState.length === 0) return;
    if (count > 0) scrollToBottom('smooth');
    if (count === 0) scrollToBottom('auto');
    setCount(count + 1);
  }, [messagesState.length]);

  useEffect(() => {
    seenMessage();
  }, []);

  const styleStatus = useMemo(() => {
    return isActive ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [isActive]);

  useEffect(() => {
    seenMessage();
  }, []);

  return (
    <StyleTotal className="h-full" theme={themeColorSet}>
      {isLoadingCurrentConversation ? (
        <></>
      ) : (
        <>
          <div
            className="header flex justify-between items-center py-6 px-6"
            style={{
              height: '13%',
              borderBottom: '1px solid',
              borderColor: themeColorSet.colorBg4
            }}>
            <div className="flex gap-3 items-center">
              {currentConversation.isGroup ? (
                <AvatarGroup
                  key={currentConversation._id}
                  users={currentConversation.users}
                />
              ) : (
                <NavLink to={`/user/${otherUser._id}`}>
                  <Avatar key={otherUser} user={otherUser} />
                </NavLink>
              )}
              <div className="flex flex-col">
                <div style={{ color: themeColorSet.colorText1 }}>
                  {currentConversation.name || (
                    <NavLink to={`/user/${otherUser._id}`}>
                      {otherUser.name}
                    </NavLink>
                  )}
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: styleStatus,
                    fontWeight: 400
                  }}>
                  {statusText}
                </div>
              </div>
            </div>
            <div className="displayShare">
              <FontAwesomeIcon
                className="text-xl mr-0 cursor-pointer"
                icon={faBars}
                onClick={() => {
                  Props.setIsDisplayShare(!Props.isDisplayShare);
                }}
              />
            </div>
          </div>
          <div
            className="body px-3"
            style={{
              height: '88%',
              overflow: 'auto'
            }}>
            <div className="flex-1 overflow-y-auto">
              {messagesState?.length !== 0 &&
                messagesState?.map((message: any, i: any) => (
                  <MessageBox
                    isLast={i === messagesState.length - 1}
                    key={message._id}
                    data={message}
                  />
                ))}
              <div className="pt-1" ref={bottomRef} />
            </div>
          </div>
        </>
      )}
    </StyleTotal>
  );
};

export default MessageChat;
