import { Col, Row, App } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faVideo, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { debounce } from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';
// import { LoadingOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { VirtualizerOptions, elementScroll, useVirtualizer } from '@tanstack/react-virtual';

import merge from '@/util/mergeClassName';
import { useOtherUser, useAppSelector, useIntersectionObserver, useAppDispatch } from '@/hooks/special';
import { useCurrentConversationData, useCurrentUserInfo, useMessages } from '@/hooks/fetch';
import { useSendMessage } from '@/hooks/mutation';
import AvatarMessage from '@/components/ChatComponents/Avatar/AvatarMessage';
import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import MessageBox from '@/components/ChatComponents/MessageBox';
import ChatInput from '@/components/ChatComponents/InputChat/InputChat';
import ConversationOption from '@/components/ChatComponents/ConversationOption';
import ChatWelcome from '@/components/ChatComponents/ChatWelcome';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { IMessage, ISocketCall, ModalType } from '@/types';
import getImageURL from '@/util/getImageURL';
import { audioCall, videoChat } from '@/util/call';
import { commonColor } from '@/util/cssVariable';
import { getLastOnline } from '@/util/formatDateTime';
import { capitalizeFirstLetter } from '@/util/convertText';
import { getTheme } from '@/util/theme';
import { Socket } from '@/util/constants/SettingSystem';
import { toggleDisplayOption } from '@/redux/Slice/MessageSlice';
import StyleProvider from './cssMessageChat';

interface IMessageChat {
  conversationID: string;
}

const soundCall = new Audio('/sounds/sound-noti-call.wav');
soundCall.loop = true;

const MessageChat: React.FC<IMessageChat> = ({ conversationID }) => {
  const { modal } = App.useApp();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const { activeMembers: members, chatSocket } = useAppSelector((state) => state.socketIO);
  const { displayOption } = useAppSelector((state) => state.message);

  const dispatch = useAppDispatch();

  const { currentUserInfo } = useCurrentUserInfo();
  const { currentConversation } = useCurrentConversationData(conversationID);
  const { messages, isLoadingMessages, fetchPreviousMessages, isFetchingPreviousPage, hasPreviousMessages } =
    useMessages(conversationID);

  const otherUser = useOtherUser(currentConversation);

  let modalVideo: ModalType, modalVoice: ModalType;

  const [count, setCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const activeUser = members.find((member) => member._id === otherUser._id);

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

    return activeUser?.is_online ? 'Online now' : getLastOnline(lastOnline);
  }, [currentConversation, activeUser, members]);

  const seenMessage = useCallback(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender._id !== currentUserInfo._id &&
      !currentConversation.seen.some((user) => user._id === currentUserInfo._id)
    ) {
      chatSocket.emit(Socket.SEEN_MSG, {
        conversationID,
        userID: currentUserInfo._id
      });
    }
  }, [currentConversation.seen, conversationID, messages]);

  const fetchPreMessages = useCallback(() => {
    if (!isFetchingPreviousPage && messages && hasPreviousMessages) void fetchPreviousMessages();
  }, [isFetchingPreviousPage, messages, hasPreviousMessages]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
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

  const { mutateSendMessage } = useSendMessage();

  const handleSendEndCall = useCallback((data: ISocketCall, type: string, status: string) => {
    const message = {
      _id: uuidv4().replace(/-/g, ''),
      conversation_id: data.conversation_id,
      sender: {
        _id: data.author._id,
        user_image: data.author.user_image,
        name: data.author.name
      },
      isSending: true,
      content: `${capitalizeFirstLetter(type)} call ${status}`,
      type: type,
      createdAt: new Date()
    };

    mutateSendMessage(message as unknown as IMessage);
    chatSocket.emit(Socket.PRIVATE_MSG, { conversationID: data.conversation_id, message });
  }, []);

  useEffect(() => {
    chatSocket.on(Socket.VIDEO_CALL, (data: ISocketCall) => {
      soundCall.currentTime = 0;
      void soundCall.play();
      modalVideo = modal.confirm({
        title: (
          <div className='flex flex-row items-center'>
            <FontAwesomeIcon className='text-xl mr-3' icon={faVideo} />
            <div className='text-xl'>Video Call</div>
          </div>
        ),
        icon: <div className='w-[17px]' />,
        content: (
          <div className='flex flex-row items-center justify-center pt-4 pb-2'>
            <img
              className='h-12 w-12 mr-3 rounded-full overflow-hidden'
              src={getImageURL(data.user_image, 'avatar_mini')}
            />
            <div className='font-semibold text-lg'>
              {data.author.name} is calling&nbsp;
              {data.typeofConversation === 'group' ? `from ${data.conversation_name}` : 'you'}
            </div>
          </div>
        ),
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover
              onClick={() => {
                chatSocket.emit(Socket.LEAVE_VIDEO_CALL, { ...data, type: 'missed' });
                void soundCall.pause();
                modalVideo?.destroy();
              }}>
              Decline
            </ButtonCancelHover>
            <ButtonActiveHover
              onClick={() => {
                videoChat(data.conversation_id);
                void soundCall.pause();
                modalVideo?.destroy();
              }}>
              Accept
            </ButtonActiveHover>
          </div>
        )
      });
    });

    chatSocket.on(Socket.VOICE_CALL, (data: ISocketCall) => {
      soundCall.currentTime = 0;
      void soundCall.play();
      modalVoice = modal.confirm({
        title: (
          <div className='flex flex-row items-center'>
            <FontAwesomeIcon className='text-xl mr-3' icon={faPhone} />
            <div className='text-xl'>Voice Call</div>
          </div>
        ),
        icon: <div className='w-[17px]' />,
        content: (
          <div className='flex flex-row items-center justify-center pt-4 pb-2'>
            <img
              className='h-12 w-12 mr-3 rounded-full overflow-hidden'
              src={getImageURL(data.user_image, 'avatar_mini')}
            />
            <div className='font-semibold text-lg'>
              {data.author.name} is calling&nbsp;
              {data.typeofConversation === 'group' ? `from ${data.conversation_name}` : 'you'}
            </div>
          </div>
        ),
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover
              onClick={() => {
                chatSocket.emit(Socket.LEAVE_VOICE_CALL, { ...data, type: 'missed' });
                void soundCall.pause();
                modalVoice?.destroy();
              }}>
              Decline
            </ButtonCancelHover>
            <ButtonActiveHover
              onClick={() => {
                audioCall(data.conversation_id);
                void soundCall.pause();
                modalVoice?.destroy();
              }}>
              Accept
            </ButtonActiveHover>
          </div>
        )
      });
    });

    chatSocket.on(Socket.END_VIDEO_CALL, (data: ISocketCall) => {
      if (modalVideo) {
        void soundCall.pause();
        modalVideo.update({
          content: (
            <div className='flex flex-row items-center justify-center pt-4 pb-2'>
              <img
                className='h-12 w-12 mr-3 rounded-full overflow-hidden'
                src={getImageURL(data.user_image, 'avatar_mini')}
              />
              <div className='font-semibold text-lg'>
                You missed a video call&nbsp;
                {data.typeofConversation === 'group'
                  ? `from ${data.conversation_name}`
                  : `from ${data.author.name}`}
              </div>
            </div>
          ),
          footer: (
            <div className='mt-6 flex items-center justify-end gap-x-3'>
              <ButtonActiveHover
                onClick={() => {
                  modalVideo?.destroy();
                }}>
                Close
              </ButtonActiveHover>
            </div>
          )
        });
      }
    });

    chatSocket.on(Socket.END_VOICE_CALL, (data: ISocketCall) => {
      if (modalVoice) {
        void soundCall.pause();
        modalVoice.update({
          content: (
            <div className='flex flex-row items-center justify-center pt-4 pb-2'>
              <img
                className='h-12 w-12 mr-3 rounded-full overflow-hidden'
                src={getImageURL(data.user_image, 'avatar_mini')}
              />
              <div className='font-semibold text-lg'>
                You missed a voice call&nbsp;
                {data.typeofConversation === 'group'
                  ? `from ${data.conversation_name}`
                  : `from ${data.author.name}`}
              </div>
            </div>
          ),
          footer: (
            <div className='mt-6 flex items-center justify-end gap-x-3'>
              <ButtonActiveHover
                onClick={() => {
                  modalVoice?.destroy();
                }}>
                Close
              </ButtonActiveHover>
            </div>
          )
        });
      }
    });

    chatSocket.on(Socket.SEND_END_VIDEO_CALL, (data: ISocketCall) => {
      handleSendEndCall(data, 'video', data.type);
    });

    chatSocket.on(Socket.SEND_END_VOICE_CALL, (data: ISocketCall) => {
      handleSendEndCall(data, 'voice', data.type);
    });

    return () => {
      chatSocket.off(Socket.VIDEO_CALL);
      chatSocket.off(Socket.VOICE_CALL);
      chatSocket.off(Socket.END_VIDEO_CALL);
      chatSocket.off(Socket.END_VOICE_CALL);
      chatSocket.off(Socket.SEND_END_VIDEO_CALL);
      chatSocket.off(Socket.SEND_END_VOICE_CALL);
    };
  }, []);

  useEffect(() => {
    chatSocket.on(Socket.IS_TYPING + conversationID, (data: string) => {
      setTypingUsers((prev) =>
        prev.some((user) => user === data) || data === currentUserInfo._id ? prev : [...prev, data]
      );
      setIsTyping(true);
    });
    chatSocket.on(Socket.STOP_TYPING + conversationID, (data: string) => {
      setIsTyping(typingUsers.length !== 1);
      setTyping(data);
    });

    if (typingDiv.current) {
      typingDiv.current.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      if (typingUsers.length === 0 || !isTyping) {
        typingDiv.current.style.opacity = '0';
        typingDiv.current.style.transform = 'translateY(0)';
      } else {
        typingDiv.current.style.opacity = '1';
        typingDiv.current.style.transform = 'translateY(calc(-2rem + 18px))';
      }
    }

    return () => {
      chatSocket.off(Socket.IS_TYPING + conversationID);
      chatSocket.off(Socket.STOP_TYPING + conversationID);
    };
  }, [typingUsers.length, currentUserInfo._id, isTyping]);

  const styleStatus = useMemo(() => {
    return activeUser?.is_online ? themeColorSet.colorText2 : themeColorSet.colorText3;
  }, [activeUser, themeColorSet]);

  const isPrevMesGroup = useCallback((message: IMessage, index: number, messArr: IMessage[]) => {
    if (index === 0) return false;
    if (!messArr) return false;

    const preMessage = messArr[index - 1];
    if (preMessage.type === 'notification') return false;

    const isSameSender = message.sender._id === preMessage.sender._id;
    if (!isSameSender) return false;

    return new Date(message.createdAt).getTime() - new Date(preMessage.createdAt).getTime() < 60000;
  }, []);

  const isNextMesGroup = useCallback((message: IMessage, index: number, messArr: IMessage[]) => {
    if (index === messArr.length - 1) return false;
    if (!messArr) return false;

    const nextMessage = messArr[index + 1];
    if (nextMessage.type === 'notification') return false;

    const isSameSender = message.sender._id === nextMessage.sender._id;
    if (!isSameSender) return false;

    return new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime() < 60000;
  }, []);

  const isMoreThan10Min = useCallback((message: IMessage, index: number, messArr: IMessage[]) => {
    if (index === 0) return true;
    if (!messArr) return false;

    const preMessage = messArr[index - 1];

    return new Date(message.createdAt).getTime() - new Date(preMessage.createdAt).getTime() > 600000;
  }, []);

  const isAdmin = useCallback(
    (userID: string) => {
      return currentConversation.admins.some((admin) => admin._id === userID);
    },
    [currentConversation]
  );

  const isCreator = useCallback(
    (userID: string) => {
      return currentConversation.creator === userID;
    },
    [currentConversation]
  );

  const scrollToBottomWhenTyping = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottomWhenTyping();
  }, [typingUsers.length]);

  const [haveMedia, setHaveMedia] = useState<boolean>(false);

  const easeInOutQuint = (t: number) => {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  };
  const parentRef = useRef<HTMLDivElement>(null);

  const scrollingRef = useRef<number>();

  const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] = useCallback(
    (offset, canSmooth, instance) => {
      const duration = 1000;
      const start = parentRef?.current?.scrollTop;
      const startTime = (scrollingRef.current = Date.now());

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
        const interpolated = start! + (offset - start!) * progress;

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance);
          requestAnimationFrame(run);
        } else {
          elementScroll(interpolated, canSmooth, instance);
        }
      };

      requestAnimationFrame(run);
    },
    []
  );
  const counts = messages?.length ?? 0;
  const virtualizer = useVirtualizer({
    count: counts,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
    scrollToFn
  });

  const items = virtualizer.getVirtualItems();

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
                    <AvatarMessage key={otherUser._id} user={otherUser} />
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
                  onClick={() => {
                    videoChat(conversationID);
                  }}
                  className='video-call text-xl cursor-pointer'
                  icon={faVideoCamera}
                  style={{ color: commonColor.colorBlue1 }}
                />
                <FontAwesomeIcon
                  className='display-share text-xl cursor-pointer'
                  onClick={() => dispatch(toggleDisplayOption())}
                  icon={faCircleInfo}
                  style={{ color: commonColor.colorBlue1 }}
                />
              </div>
            </div>
            <div
              className={merge(
                'body',
                haveMedia ? 'h-[72%]' : 'h-[83%]',
                typingUsers.length ? 'pb-6' : 'pb-1'
              )}
              style={{
                overflow: 'auto',
                backgroundImage: `url(${getImageURL(currentConversation.cover_image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                paddingLeft: '1rem'
              }}>
              <AutoSizer>
                {({ height, width }) => (
                  <>
                    <div
                      ref={parentRef}
                      className='list-image'
                      style={{
                        height: height,
                        width: width,
                        overflowY: 'auto',
                        contain: 'strict'
                      }}>
                      <div
                        ref={topRef}
                        style={{
                          height: virtualizer.getTotalSize(),
                          width: '100%',
                          position: 'relative'
                        }}>
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${items[0]?.start ?? 0}px)`
                          }}>
                          {!hasPreviousMessages && (
                            <ChatWelcome
                              type={currentConversation.type}
                              name={currentConversation.name}
                              members={currentConversation.members}
                              otherUser={otherUser}
                              image={currentConversation.image}
                            />
                          )}
                          {items.map((virtualRow) => (
                            <div
                              key={virtualRow.key}
                              data-index={virtualRow.index}
                              ref={virtualizer.measureElement}
                              className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}>
                              <div>
                                <MessageBox
                                  type={currentConversation.type}
                                  isLastMes={virtualRow.index === items.length - 1}
                                  message={messages[virtualRow.index]}
                                  seen={currentConversation.seen}
                                  isAdmin={isAdmin(messages[virtualRow.index].sender._id)}
                                  isCreator={isCreator(messages[virtualRow.index].sender._id)}
                                  isPrevMesGroup={isPrevMesGroup(
                                    messages[virtualRow.index],
                                    virtualRow.index,
                                    messages
                                  )}
                                  isNextMesGroup={isNextMesGroup(
                                    messages[virtualRow.index],
                                    virtualRow.index,
                                    messages
                                  )}
                                  isMoreThan10Min={isMoreThan10Min(
                                    messages[virtualRow.index],
                                    virtualRow.index,
                                    messages
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                          <div ref={messageRef}></div>
                          <div ref={bottomRef}></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </AutoSizer>
            </div>
            <div className='px-2 flex flex-row items-center opacity-0' ref={typingDiv}>
              {currentConversation.members.map((member) => {
                const index = typingUsers.findIndex((user) => user === member._id);
                if (index !== -1) {
                  return (
                    <img
                      key={member._id}
                      className='rounded-full -top-2 absolute h-6 w-6 overflow-hidden'
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
            <ChatInput
              conversationID={conversationID}
              members={currentConversation.members}
              setHaveMedia={setHaveMedia}
            />
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
