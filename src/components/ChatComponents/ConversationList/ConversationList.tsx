import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigProvider, Input, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { find } from 'lodash';
import { NavLink, useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleTotal from './cssConversationList';
import { pusherClient } from '@/util/functions/Pusher';
import { getTheme } from '@/util/functions/ThemeFunction';
import { messageService } from '@/services/MessageService';
import OpenGroupModal from '@/components/ActionComponent/OpenDetail/OpenGroupModal';
import Avatar from '@/components/Avatar/AvatarMessage';
import ConversationBox from '@/components/ChatComponents/ConversationBox';
import { RootState } from '@/redux/configStore';

interface ConversationListProps {
  initialItems: any;
  users: [];
  title?: string;
  selected?: string;
}

const ConversationList = (Props: ConversationListProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const navigate = useNavigate();

  const userInfo = useSelector(
    (state: RootState) => state.userReducer.userInfo
  );

  const { members } = useSelector(
    (state: RootState) => state.activeListReducer
  );

  const [items, setItems] = useState(Props.initialItems);

  const pusherKey = useMemo(() => {
    return userInfo?.id;
  }, [userInfo]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: any) => {
      setItems((current: any) =>
        current.map((currentConversation: any) => {
          if (currentConversation._id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }

          return currentConversation;
        })
      );
      // sort lại conversation theo thời gian
      setItems((current: any) => {
        return current.sort((a: any, b: any) => {
          const aTime =
            a.messages.length > 0
              ? a.messages[a.messages.length - 1].createdAt
              : a.createdAt;
          const bTime =
            b.messages.length > 0
              ? b.messages[b.messages.length - 1].createdAt
              : b.createdAt;

          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });
    };

    const newHandler = (conversation: any) => {
      setItems((current: any) => {
        if (find(current, { _id: conversation._id })) {
          return current;
        }

        return [conversation, ...current];
      });
      // sort lại conversation theo thời gian
      setItems((current: any) => {
        return current.sort((a: any, b: any) => {
          const aTime =
            a.messages.length > 0
              ? a.messages[a.messages.length - 1].createdAt
              : a.createdAt;
          const bTime =
            b.messages.length > 0
              ? b.messages[b.messages.length - 1].createdAt
              : b.createdAt;

          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });
    };

    const removeHandler = (conversation: any) => {
      setItems((current: any) => {
        return [...current.filter((convo: any) => convo._id !== conversation)];
      });
    };

    pusherClient.bind('conversation-update', updateHandler);
    pusherClient.bind('new-conversation', newHandler);
    pusherClient.bind('conversation-remove', removeHandler);
  }, [pusherKey]);

  const [messages, setMessages] = useState<any[]>(Props.initialItems);

  useEffect(() => {
    if (!messages) return;

    const unseenConversations = messages.filter((conversation: any) => {
      if (conversation.messages?.length === 0) return false;
      const seenList =
        conversation.messages[conversation.messages.length - 1].seen || [];
      return !seenList.some((user: any) => user._id === userInfo.id);
    });

    if (unseenConversations.length > 0) {
      document.title = `(${unseenConversations.length}) DevHub Message`;
    } else {
      document.title = `DevHub Message`;
    }
  }, [messages]);

  const playNotiMessage = new Audio('/sounds/sound-noti-message.wav');

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: any) => {
      setMessages((current: any) =>
        current.map((currentConversation: any) => {
          if (currentConversation._id === conversation.id) {
            playNotiMessage.play();
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }

          return currentConversation;
        })
      );
    };

    const updateHandlerSeen = (conversation: any) => {
      setMessages((current: any) =>
        current.map((currentConversation: any) => {
          if (currentConversation._id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }

          return currentConversation;
        })
      );
    };

    pusherClient.bind('conversation-update-seen', updateHandlerSeen);
    pusherClient.bind('conversation-update-noti', updateHandler);
  }, [pusherKey]);

  const HandleOnClick = async (item: any) => {
    const { data } = await messageService.createConversation({
      users: [item, userInfo.id]
    });
    navigate(`/message/${data.content.conversation._id}`);
  };

  // Open OtherPostDetailModal
  const [isOpenPostDetail, setIsOpenPostDetail] = useState(false);

  const { visible } = useSelector((state: RootState) => state.modalHOCReducer);

  useEffect(() => {
    if (!visible && isOpenPostDetail) {
      setIsOpenPostDetail(!isOpenPostDetail);
    }
  }, [visible, isOpenPostDetail]);

  const formatUsername = (username: any) => {
    const MAX_LENGTH = 14; // maximum length of username on one line
    const words = username.split(' ');
    const lines = [];
    let currentLine = '';

    // add each word to a line, breaking onto new line if line is too long
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (currentLine.length + word.length > MAX_LENGTH) {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    // add any remaining words to the last line
    if (currentLine.length > 0) {
      lines.push(currentLine.trim());
    }

    // return the formatted username
    return lines.join('\n');
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {isOpenPostDetail && <OpenGroupModal users={Props.users} />}
        <div className="searchChat h-screen">
          <Space
            className="myInfo flex justify-between items-center py-4 px-3"
            style={{
              borderBottom: '1px solid',
              borderColor: themeColorSet.colorBg4,
              height: '12%'
            }}>
            <div className="flex">
              <NavLink to={`/user/${userInfo.id}`}>
                <div className="avatar mr-3">
                  <Avatar key={userInfo.id} user={userInfo} />
                </div>
              </NavLink>
              <div className="name_career">
                <NavLink to={`/user/${userInfo.id}`}>
                  <div
                    className="name mb-1"
                    style={{
                      color: themeColorSet.colorText1,
                      fontWeight: 600
                    }}>
                    {userInfo.lastname}
                  </div>
                </NavLink>
                <div
                  className="career"
                  style={{
                    color: themeColorSet.colorText3
                  }}>
                  UX/UI Designer
                </div>
              </div>
            </div>
            <div
              className="iconPlus cursor-pointer"
              onClick={() => setIsOpenPostDetail(!isOpenPostDetail)}>
              <FontAwesomeIcon
                className="text-xl"
                icon={faUsersLine}
                color={themeColorSet.colorText1}
              />
            </div>
          </Space>
          <div
            className="searchInput px-3 py-4 w-full flex justify-between items-center"
            style={{
              borderBottom: '1px solid',
              borderColor: themeColorSet.colorBg4,
              height: '11%'
            }}>
            <div className="input flex items-center w-full">
              <div
                className="iconSearch mr-2"
                style={{
                  color: themeColorSet.colorText3
                }}>
                <SearchOutlined className="text-2xl" />
              </div>
              <ConfigProvider
                theme={{
                  token: {
                    lineWidth: 0,
                    controlHeight: 40,
                    borderRadius: 0
                  }
                }}>
                <Input
                  placeholder="Search"
                  className="mr-4"
                  style={{
                    width: '90%'
                  }}
                />
              </ConfigProvider>
            </div>
          </div>
          <div
            className="userActive px-3 py-4 w-full"
            style={{
              borderBottom: '1px solid',
              borderColor: themeColorSet.colorBg4,
              height: '27%'
            }}>
            <div
              className="title"
              style={{
                fontWeight: 600,
                color: themeColorSet.colorText1
              }}>
              People
            </div>
            <div
              className="listUser flex mt-5"
              style={{
                overflow: 'auto'
              }}>
              {Props.users.map((item: any) => {
                return (
                  <div
                    className="user flex flex-col items-center cursor-pointer w-1/2 mt-5"
                    key={item._id}
                    onClick={() => HandleOnClick(item._id)}>
                    <div className="avatar relative">
                      <Avatar key={item._id} user={item} />
                    </div>
                    <div
                      className="name text-center mt-2"
                      style={{
                        fontSize: '0.9rem',
                        color: themeColorSet.colorText1
                      }}>
                      {formatUsername(item.username)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="userChat"
            style={{
              height: '57%',
              overflow: 'auto'
            }}>
            {items.map(
              (item: any) =>
                (item.messages.length > 0 || item.isGroup) && (
                  <NavLink to={`/message/${item._id}`}>
                    <ConversationBox
                      key={item._id}
                      data={item}
                      selected={item._id === Props.selected}
                    />
                  </NavLink>
                )
            )}
          </div>
          <div className="listUser"></div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default ConversationList;
