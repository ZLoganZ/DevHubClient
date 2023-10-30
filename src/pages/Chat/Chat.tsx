import { Col, ConfigProvider, Dropdown, Row, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake, faComment, faUser, faBell, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';
import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { v4 as uuidv4 } from 'uuid';
import { NavLink, useParams } from 'react-router-dom';

import ConversationList from '@/components/ChatComponents/ConversationList';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import LoadingChat from '@/components/Loading/LoadingChat';
import EmptyChat from '@/components/ChatComponents/EmptyChat';
import LoadingLogo from '@/components/Loading/LoadingLogo';
import MessageChat from '@/components/ChatComponents/MessageChat';
import ContactList from '@/components/ChatComponents/ContactList';

import { useConversationsData, useCurrentConversationData, useCurrentUserInfo } from '@/hooks/fetch';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { setTheme } from '@/redux/Slice/ThemeSlice';
import { getTheme } from '@/util/theme';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';

import StyleProvider from './cssChat';

const Chat = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet, themeColor } = getTheme();

  const { conversationID } = useParams();

  const { isLoadingCurrentUserInfo, currentUserInfo } = useCurrentUserInfo();
  const { conversations, isLoadingConversations } = useConversationsData();
  const { isLoadingCurrentConversation } = useCurrentConversationData(conversationID);

  const followers = useMemo(() => {
    return [...(currentUserInfo?.followers ?? []), ...(currentUserInfo?.following ?? [])].filter(
      (item, index, arr) => arr.findIndex((t) => t._id === item._id) === index
    );
  }, [currentUserInfo]);

  const dispatch = useAppDispatch();
  const change = (checked: boolean) => {
    if (checked) {
      dispatch(setTheme({ theme: DARK_THEME }));
    } else {
      dispatch(setTheme({ theme: LIGHT_THEME }));
    }
  };

  useEffect(() => {
    document.title = 'DevHub Chat';
  }, []);

  const settingItem: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className='item flex items-center px-4 py-2'>
          <span className='ml-2'>Setting</span>
        </div>
      )
    }
  ];

  const notSeenCount = useMemo(() => {
    if (!currentUserInfo || !conversations) return 0;
    return conversations.reduce((count, conversation) => {
      if (
        conversation.seen.some((user) => user._id === currentUserInfo._id) ||
        conversation.lastMessage?.sender?._id === currentUserInfo._id ||
        !conversation.lastMessage
      )
        return count;

      return count + 1;
    }, 0);
  }, [conversations]);

  const contactCount = useMemo(() => {
    if (!followers) return 0;
    return followers.length;
  }, [followers]);

  const [optionIndex, setOptionIndex] = useState(0);

  const options = [
    { name: 'message', icon: faComment, count: notSeenCount },
    { name: 'contact', icon: faUser, count: contactCount },
    { name: 'notification', icon: faBell, count: 99 },
    { name: 'voice-call', icon: faPhone, count: 66 }
  ];

  const OptionRender = useMemo(() => {
    switch (optionIndex) {
      case 0:
        return <ConversationList conversations={conversations} selected={conversationID} />;
      case 1:
        return <ContactList followers={followers ?? []} />;
      case 2:
        return <></>;
      case 3:
        return <></>;
      default:
        return <></>;
    }
  }, [conversations, followers, conversationID, optionIndex]);

  useMediaQuery({ maxWidth: 639 });

  if (isLoadingCurrentUserInfo) return <LoadingLogo />;

  return (
    <ConfigProvider theme={{ token: themeColor }}>
      <StyleProvider theme={themeColorSet}>
        {isLoadingConversations ? (
          <LoadingChat />
        ) : (
          <div className='chat overflow-hidden'>
            <Row className='slider'>
              <Col span={1} className='py-3 flex flex-col justify-between items-center'>
                <div>
                  <div className='logo items-center'>
                    <NavLink to='/' className='icon_logo'>
                      <FontAwesomeIcon className='icon' icon={faSnowflake} />
                    </NavLink>
                  </div>
                  <div className='option py-8 flex flex-col items-center'>
                    <Space size={35} direction='vertical' align='center'>
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className={`optionItem relative ${option.name}`}
                          onClick={() => setOptionIndex(index)}
                          style={optionIndex === index ? { color: themeColorSet.colorText1 } : {}}>
                          <FontAwesomeIcon className='icon text-2xl' icon={option.icon} />
                          <span
                            className='absolute rounded-full
                            bg-red-600
                            top-4 -right-2
                            h-5 w-5 flex items-center justify-center
                            text-xs text-gray-50'>
                            {option.count}
                          </span>
                        </div>
                      ))}
                    </Space>
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mode optionItem py-6'>
                    <FontAwesomeIcon
                      className='icon text-2xl'
                      icon={themeColorSet.colorPicker === 'light' ? faMoon : faSun}
                      onClick={() => {
                        change(themeColorSet.colorPicker === 'light');
                      }}
                    />
                  </div>
                  <div className='mode'>
                    <Dropdown menu={{ items: settingItem }} trigger={['click']}>
                      <div className='Setting optionItem'>
                        <FontAwesomeIcon className='icon text-3xl' icon={faGear} />
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </Col>
              <Col span={5}>{OptionRender}</Col>
              <Col span={18}>
                <div className='chatBox h-screen'>
                  {!conversationID ? (
                    <EmptyChat key={uuidv4().replace(/-/g, '')} />
                  ) : isLoadingCurrentConversation ? (
                    <LoadingConversation />
                  ) : (
                    <div className='h-screen'>
                      <MessageChat key={conversationID} conversationID={conversationID} />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Chat;
