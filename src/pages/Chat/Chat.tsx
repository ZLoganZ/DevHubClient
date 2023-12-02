import { Col, ConfigProvider, Dropdown, Row, Space, type MenuProps, Badge, App } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSnowflake,
  faComment,
  faUser,
  faBell,
  faGear,
  faVideo,
  faCloudSun
} from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useParams } from 'react-router-dom';

import LoadingChat from '@/components/Loading/LoadingChat';
import LoadingLogo from '@/components/Loading/LoadingLogo';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import ConversationList from '@/components/ChatComponents/ConversationList';
import EmptyChat from '@/components/ChatComponents/EmptyChat';
import MessageChat from '@/components/ChatComponents/MessageChat';
import ContactList from '@/components/ChatComponents/ContactList';
import CalledList from '@/components/ChatComponents/CalledList';

import {
  useConversationsData,
  useCurrentConversationData,
  useCurrentUserInfo,
  useGetCalled
} from '@/hooks/fetch';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { setTheme } from '@/redux/Slice/ThemeSlice';
import { getTheme } from '@/util/theme';
import merge from '@/util/mergeClassName';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';

import StyleProvider from './cssChat';

const Chat = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet, themeColor } = getTheme();

  const { conversationID } = useParams();

  const { isLoadingCurrentUserInfo, currentUserInfo } = useCurrentUserInfo();
  const { conversations, isLoadingConversations } = useConversationsData();
  const { isLoadingCurrentConversation } = useCurrentConversationData(conversationID);
  const { calledList } = useGetCalled();

  const dispatch = useAppDispatch();
  const change = (checked: boolean) => {
    if (checked) {
      dispatch(setTheme({ theme: DARK_THEME }));
    } else {
      dispatch(setTheme({ theme: LIGHT_THEME }));
    }
  };

  const contacts = useMemo(() => {
    return currentUserInfo?.members ?? [];
  }, [currentUserInfo?.members]);

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
    if (!contacts) return 0;
    return contacts.length;
  }, [contacts]);

  const [optionIndex, setOptionIndex] = useState(0);

  const options = [
    { name: 'new message', icon: faComment, count: notSeenCount },
    { name: 'contact', icon: faUser, count: contactCount },
    // { name: 'new notification', icon: faBell, count: 99 },
    { name: 'missing call', icon: faVideo, count: calledList?.length ?? 0 }
  ];

  const OptionRender = useMemo(() => {
    switch (optionIndex) {
      case 0:
        return <ConversationList conversations={conversations} selecting={conversationID} />;
      case 1:
        return <ContactList contacts={contacts} />;
      // case 2:
      //   return <></>;
      case 2:
        return <CalledList />;
      default:
        return <></>;
    }
  }, [conversations, contacts, conversationID, optionIndex, calledList]);

  useMediaQuery({ maxWidth: 639 });

  return (
    <ConfigProvider theme={{ token: themeColor }}>
      <StyleProvider theme={themeColorSet}>
        <App>
          {isLoadingCurrentUserInfo ? (
            <LoadingLogo />
          ) : isLoadingConversations ? (
            <LoadingChat />
          ) : (
            <div className='chat overflow-hidden'>
              <Row className='slider'>
                <Col
                  span={1}
                  className='py-3 flex flex-col justify-between items-center'
                  style={{ backgroundColor: themeColorSet.colorBg2 }}>
                  <div className='option pt-1 flex flex-col items-center'>
                    <NavLink to='/' className='icon_logo'>
                      <FontAwesomeIcon className='icon' icon={faSnowflake} />
                    </NavLink>
                    <Space size={10} direction='vertical' align='center'>
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className={merge('optionItem flex p-4 rounded-xl transition-colors', option.name)}
                          onClick={() => setOptionIndex(index)}
                          style={optionIndex === index ? { backgroundColor: themeColorSet.colorBg4 } : {}}>
                          <Badge
                            count={option.count}
                            key={index}
                            title={`You have ${option.count} ${option.name}${option.count > 1 && 's'}`}>
                            <FontAwesomeIcon className='icon text-2xl' icon={option.icon} />
                          </Badge>
                        </div>
                      ))}
                    </Space>
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='mode optionItem flex items-center justify-center h-[62px] w-[62px] p-4 rounded-xl'>
                      <FontAwesomeIcon
                        className='icon text-2xl'
                        icon={themeColorSet.colorPicker === 'light' ? faMoon : faCloudSun}
                        onClick={() => {
                          change(themeColorSet.colorPicker === 'light');
                        }}
                      />
                    </div>
                    <div className='mode'>
                      <Dropdown menu={{ items: settingItem }} trigger={['click']}>
                        <div className='Setting optionItem flex p-4 rounded-xl'>
                          <FontAwesomeIcon className='icon text-3xl' icon={faGear} />
                        </div>
                      </Dropdown>
                    </div>
                  </div>
                </Col>
                <Col span={5} className='h-screen z-10'>
                  {OptionRender}
                </Col>
                <Col span={18} className='pl-3 z-0'>
                  <div
                    className='chatBox h-screen'
                    style={{
                      borderLeft: '1px solid ' + themeColorSet.colorTextReverse2,
                      backgroundColor: themeColorSet.colorBg1
                    }}>
                    {!conversationID ? (
                      <EmptyChat />
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
        </App>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Chat;
