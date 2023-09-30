import { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Button, Col, ConfigProvider, Dropdown, Empty, Row, Space, notification } from 'antd';
import type { MenuProps } from 'antd';
import { format } from 'date-fns';
import { Header } from 'antd/es/layout/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import Title from 'antd/es/typography/Title';
import { NavLink, useNavigate } from 'react-router-dom';
import Search from 'antd/es/transfer/search';
import { BellOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

import { setTheme } from '@/redux/Slice/ThemeSlice';
import { LOGOUT_SAGA } from '@/redux/ActionSaga/AuthActionSaga';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import DayNightSwitch from '@/components/Day&NightSwitch';
import AvatarMessage from '@/components/Avatar/AvatarMessage';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';
import { pusherClient } from '@/util/pusher';
import { getTheme } from '@/util/theme';

import { useAllPostsNewsfeedData, useConversationsData, useUserInfo } from '@/hooks/fetch';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssHeaders';

const Headers = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const switchTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : true;
  const { userInfo } = useUserInfo();

  // Switch theme
  const dispatch = useAppDispatch();
  const onChange = (checked: boolean) => {
    if (checked) {
      dispatch(setTheme({ theme: DARK_THEME }));
    } else {
      dispatch(setTheme({ theme: LIGHT_THEME }));
    }
  };

  const { refetchAllPostsNewsfeed } = useAllPostsNewsfeedData();

  const handleClick = useCallback(() => {
    const { pathname } = window.location;
    if (pathname === '/') {
      refetchAllPostsNewsfeed();
    }
  }, [refetchAllPostsNewsfeed, window.location.pathname]);

  const handleLogout = () => {
    dispatch(LOGOUT_SAGA());
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <NavLink to={`/user/${userInfo._id}`}>
          <div
            className='flex items-center py-1 px-1'
            style={{
              height: '12%'
            }}>
            <div className='avatar relative'>
              <Avatar key={userInfo._id} src={userInfo.user_image} />
            </div>
            <div className='name_career'>
              <div
                className='name ml-4'
                style={{
                  color: themeColorSet.colorText1,
                  fontWeight: 600
                }}>
                {userInfo.name}
              </div>
            </div>
          </div>
        </NavLink>
      )
    },
    {
      key: '2',
      label: (
        <Button className='w-full h-full' onClick={handleLogout}>
          Log Out
        </Button>
      )
    }
  ];

  const itemsNoti: MenuProps['items'] = [
    {
      key: '-1',
      label: <Empty className='cursor-default px-40' image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
  ];

  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

  const [countUnseen, setCountUnseen] = useState(0);
  const [countNoti, setCountNoti] = useState(0);

  const { conversations, isLoadingConversations } = useConversationsData();

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (isLoadingConversations) return;

    setMessages(conversations);
  }, [conversations, isLoadingConversations]);

  // useEffect(() => {
  //   if (isLoadingConversations) return;

  //   const unseenConversations = messages.filter((conversation: any) => {
  //     if (conversation.messages?.length === 0) return false;
  //     const seenList =
  //       conversation.messages[conversation.messages.length - 1].seen || [];
  //     return !seenList.some((user: any) => user._id === userInfo._id);
  //   });

  //   if (unseenConversations.length > 0) {
  //     document.title = `(${unseenConversations.length}) DevHub`;
  //     setCountUnseen(unseenConversations.length);
  //   } else {
  //     document.title = `DevHub`;
  //     setCountUnseen(0);
  //   }
  // }, [messages, isLoadingConversations]);

  const pusherKey = useMemo(() => {
    return userInfo._id;
  }, [userInfo]);

  const playNotiMessage = new Audio('/sounds/sound-noti-message.wav');

  const popupNotification = (message: any, conversation: any) => {
    api.open({
      message: message.sender.name + ' ' + format(new Date(message.createdAt), 'p'),
      description: message.body ? message.body : 'Sent an image',
      duration: 5,
      icon: conversation.isGroup ? (
        <AvatarGroup key={conversation._id} users={conversation.users} />
      ) : (
        <AvatarMessage key={conversation._id} user={message.sender} />
      ),
      placement: 'bottomRight',
      btn: (
        <Button
          type='primary'
          size='small'
          onClick={() => {
            navigate(`/message/${conversation._id}`);
          }}>
          Go to message
        </Button>
      )
    });
  };

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: any) => {
      setMessages((current: any) =>
        current.map((currentConversation: any) => {
          if (currentConversation._id === conversation.id) {
            playNotiMessage.play();
            popupNotification(conversation.messages[conversation.messages.length - 1], currentConversation);
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

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 38
        }
      }}>
      <StyleProvider theme={themeColorSet}>
        {contextHolder}
        <Header
          className='header xs:px-2'
          style={{
            backgroundColor: themeColorSet.colorBg2,
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999,
            width: '100%',
            height: '5rem'
          }}>
          <Row align='middle'>
            <Col span={isXsScreen ? 24 : 16} offset={isXsScreen ? 0 : 4}>
              <Row align='middle'>
                <Col className='xs:pt-1' span={isXsScreen ? 2 : 4}>
                  <NavLink to='/' onClick={handleClick}>
                    <FontAwesomeIcon
                      className='iconLogo text-3xl xs:hidden'
                      icon={faSnowflake}
                      style={{ color: themeColorSet.colorText1 }}
                    />
                    <Title
                      onClick={handleClick}
                      level={2}
                      className='title inline-block ml-2 xs:hidden'
                      style={{ color: themeColorSet.colorText1 }}>
                      <div className='animated-word'>
                        <div className='letter'>D</div>
                        <div className='letter'>e</div>
                        <div className='letter'>v</div>
                        <div className='letter'>H</div>
                        <div className='letter'>u</div>
                        <div className='letter'>b</div>
                      </div>
                    </Title>
                  </NavLink>
                </Col>
                <Col span={isXsScreen ? 9 : 15} className='px-4'>
                  <Search placeholder='Search' />
                </Col>
                <Col span={5} className='pl-3 xs:pl-0'>
                  <Space size={isXsScreen ? 8 : 25}>
                    <NavLink to='/message'>
                      <Badge count={countUnseen}>
                        <Avatar
                          className='messageButton cursor-pointer'
                          shape='circle'
                          icon={<CommentOutlined className='text-xl' />}
                        />
                      </Badge>
                    </NavLink>
                    <Dropdown arrow menu={{ items: itemsNoti }} trigger={['click']} placement='bottom'>
                      <Badge count={countNoti}>
                        <Avatar
                          className='notiButton cursor-pointer'
                          icon={<BellOutlined className='text-xl' />}
                        />
                      </Badge>
                    </Dropdown>
                    <Dropdown
                      arrow
                      menu={{ items }}
                      trigger={['click']}
                      placement='bottom'
                      overlayStyle={{ paddingTop: '0.5rem' }}>
                      <Avatar
                        className='avatarButton cursor-pointer'
                        icon={<UserOutlined />}
                        size='default'
                      />
                    </Dropdown>
                    <DayNightSwitch checked={switchTheme} onChange={onChange} />
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Headers;
