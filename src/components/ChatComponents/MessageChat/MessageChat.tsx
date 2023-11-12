import { Col, Row, App, type ModalFuncProps } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPhone, faVideo, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { debounce } from 'lodash';
// import { VariableSizeList as List } from 'react-window'
// import AutoSizer from 'react-virtualized-auto-sizer'
// import { LoadingOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

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
import { IMessage, ISocketCall } from '@/types';
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

type ModalType =
  | {
      destroy: () => void;
      update: (configUpdate: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void;
      then<T>(resolve: (confirmed: boolean) => T, reject: VoidFunction): Promise<T>;
    }
  | undefined;

const soundCall = new Audio('/sounds/sound-noti-call.wav');
soundCall.loop = true;

const MessageChat: React.FC<IMessageChat> = ({ conversationID }) => {
  const { modal } = App.useApp();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const { members, chatSocket } = useAppSelector((state) => state.socketIO);
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
                chatSocket.emit(Socket.LEAVE_VIDEO_CALL, data);
                modalVideo?.destroy();
              }}>
              Decline
            </ButtonCancelHover>
            <ButtonActiveHover
              rounded
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
                chatSocket.emit(Socket.LEAVE_VOICE_CALL, data);
                modalVoice?.destroy();
              }}>
              Decline
            </ButtonCancelHover>
            <ButtonActiveHover
              rounded
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
                rounded
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
                rounded
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
              style={{
                height: '90%',
                overflow: 'auto',
                backgroundImage: `url(${getImageURL(currentConversation.cover_image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
              <div className='body flex-1 h-[92%] overflow-auto'>
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
                    key={conversationID + '|' + message._id}
                    ref={index === 20 ? topRef : null}
                    type={currentConversation.type}
                    isLastMes={index === messArr.length - 1}
                    message={message}
                    seen={currentConversation.seen}
                    isAdmin={isAdmin(message.sender._id)}
                    isCreator={isCreator(message.sender._id)}
                    isPrevMesGroup={isPrevMesGroup(message, index, messArr)}
                    isNextMesGroup={isNextMesGroup(message, index, messArr)}
                    isMoreThan10Min={isMoreThan10Min(message, index, messArr)}
                  />
                ))}
                <div className='pb-1' ref={bottomRef} />
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
              <ChatInput conversationID={conversationID} members={currentConversation.members} />
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
