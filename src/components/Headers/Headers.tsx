import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Empty,
  Row,
  Space,
  type MenuProps,
  Layout,
  Input,
  Affix
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { BellOutlined, CommentOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from 'react-responsive';

import { setTheme } from '@/redux/Slice/ThemeSlice';
import { LOGOUT_SAGA } from '@/redux/ActionSaga/AuthActionSaga';
import DayNightSwitch from '@/components/Day&NightSwitch';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { getDateTimeToNow } from '@/util/formatDateTime';

import { useCurrentUserInfo, useGetNoti, useGetSearchLogs, useGetUsersByName } from '@/hooks/fetch';
import { useAppDispatch, useAppSelector, useDebounce } from '@/hooks/special';
import StyleProvider from './cssHeaders';
import AvatarMessage from '../ChatComponents/Avatar/AvatarMessage';
import { IUserInfo } from '@/types';
import { useCreateSearchLog } from '@/hooks/mutation';
const Headers = () => {
  const navigate = useNavigate();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const switchTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : true;
  const { currentUserInfo } = useCurrentUserInfo();

  const noti = useGetNoti(currentUserInfo?.id_incr).noti;

  const [search, setSearch] = useState('');

  const searchDebounce = useDebounce(search, 500);

  const { usersByName } = useGetUsersByName(searchDebounce);

  const queryClient = useQueryClient();

  // Switch theme
  const dispatch = useAppDispatch();
  const onChange = (checked: boolean) => {
    if (checked) {
      dispatch(setTheme({ theme: DARK_THEME }));
    } else {
      dispatch(setTheme({ theme: LIGHT_THEME }));
    }
  };

  const handleClick = useCallback(() => {
    const { pathname } = window.location;
    if (pathname === '/') {
      queryClient.resetQueries({ queryKey: ['allNewsfeedPosts'] });
    } else {
      navigate('/');
    }
  }, [window.location.pathname]);

  const handleLogout = () => {
    dispatch(LOGOUT_SAGA());
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <NavLink to={`/user/${currentUserInfo._id}`}>
          <div className='flex items-center py-1 px-1'>
            <div className='avatar relative h-9 w-9 overflow-hidden rounded-full'>
              <img key={currentUserInfo._id} src={getImageURL(currentUserInfo.user_image, 'avatar_mini')} />
            </div>
            <div className='name_career'>
              <div
                className='name ml-4'
                style={{
                  color: themeColorSet.colorText1,
                  fontWeight: 600
                }}>
                {currentUserInfo.name}
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
      label: (
        <Empty
          className='cursor-default px-40'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='No notifications'
        />
      )
    }
  ];

  if (noti && noti.length !== 0) {
    itemsNoti.pop();
    noti.forEach((item) => {
      itemsNoti.push({
        key: item._id,
        label: (
          <NavLink
            to={
              item.type.includes('POST') || item.type.includes('COMMENT')
                ? `/post/${item.options.post}`
                : `/user/${item.sender._id}`
            }>
            <div className='flex items-center py-1 px-1'>
              <div className='avatar relative h-9 w-9 overflow-hidden rounded-full'>
                <img key={item._id} src={getImageURL(item.sender.user_image, 'avatar_mini')} />
              </div>
              <div className='name_career'>
                <div
                  className='name ml-4 font-bold'
                  style={{
                    color: themeColorSet.colorText1,
                    fontWeight: 600
                  }}>
                  {item.sender.name + ' '}
                  <span
                    style={{
                      color: themeColorSet.colorText1,
                      fontWeight: 400
                    }}>
                    {item.content}
                  </span>
                </div>
                <div className='time ml-4' style={{ color: themeColorSet.colorText2 }}>
                  {getDateTimeToNow(item.createAt)}
                </div>
              </div>
            </div>
          </NavLink>
        )
      });
    });
  }

  const isMdScreen = useMediaQuery({ maxWidth: 1023 });

  // const popupNotification = (message: any, conversation: any) => {
  //   api.open({
  //     message: message.sender.name + ' ' + format(new Date(message.createdAt), 'p'),
  //     description: message.body ? message.body : 'Sent an image',
  //     duration: 5,
  //     icon: conversation.isGroup ? (
  //       <AvatarGroup key={conversation._id} users={conversation.users} />
  //     ) : (
  //       <AvatarMessage key={conversation._id} user={message.sender} />
  //     ),
  //     placement: 'bottomRight',
  //     btn: (
  //       <Button
  //         type='primary'
  //         size='small'
  //         onClick={() => {
  //           navigate(`/message/${conversation._id}`);
  //         }}>
  //         Go to message
  //       </Button>
  //     )
  //   });
  // };

  const { searchLogs, isLoadingSearchLogs } = useGetSearchLogs();

  const { mutateCreateSearchLog } = useCreateSearchLog();

  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const handleSearchClick = () => {
    setIsListVisible(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsListVisible(false);
    }, 100);
  };

  const handleShowUserProfile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation();
    mutateCreateSearchLog({
      user: currentUserInfo._id,
      recently_search: id
    }).then(() => {
      queryClient.resetQueries({ queryKey: ['searchLogs'] });
    });
    navigate(`/user/${id}`);
  };

  const getSearchPage = (search: string) => {
    if (search.trim() === '') return;
    mutateCreateSearchLog({
      user: currentUserInfo._id,
      keyword: search.trim()
    }).then(() => {
      queryClient.resetQueries({ queryKey: ['searchLogs'] });
    });
    navigate(`/search/top?search=${search}`);
    setIsListVisible(false);
  };

  const handleSearch = (key: string) => {
    setSearch(key.trim());
  };

  useEffect(() => {
    if (searchDebounce !== '' && usersByName) {
      setUsers(usersByName);
    } else {
      setUsers([]);
    }
  }, [usersByName, searchDebounce]);

  return (
    <ConfigProvider theme={{ token: { controlHeight: 38 } }}>
      <Affix>
        <StyleProvider theme={themeColorSet}>
          <Layout.Header
            className='header md:px-2'
            style={{
              backgroundColor: themeColorSet.colorBg2,
              height: '5rem'
            }}>
            <Row align='middle'>
              <Col span={isMdScreen ? 24 : 16} offset={isMdScreen ? 0 : 4}>
                <Row align='middle'>
                  <Col span={isMdScreen ? 5 : 4} offset={isMdScreen ? 2 : 0}>
                    <div className='flex items-center cursor-pointer' onClick={handleClick}>
                      <FontAwesomeIcon
                        className='iconLogo text-3xl'
                        icon={faSnowflake}
                        style={{ color: themeColorSet.colorText1 }}
                      />
                      <div className='animated-word text-3xl ml-2 font-semibold'>
                        <p className='letter'>D</p>
                        <p className='letter'>e</p>
                        <p className='letter'>v</p>
                        <p className='letter'>H</p>
                        <p className='letter'>u</p>
                        <p className='letter'>b</p>
                      </div>
                    </div>
                  </Col>
                  <Col span={isMdScreen ? 9 : 15} className='px-4 items-center'>
                    <Input
                      allowClear
                      placeholder='Search'
                      autoComplete='off'
                      className='rounded-full'
                      prefix={<SearchOutlined className='text-xl mr-1' />}
                      onClick={handleSearchClick}
                      onBlur={handleSearchBlur}
                      onPressEnter={(e) => getSearchPage(e.currentTarget.value)}
                      onInput={(e) => handleSearch(e.currentTarget.value)}
                    />
                    {isListVisible && (
                      <div className='listSearch leading-none flex flex-col gap-1.5 absolute w-[95%] z-10 rounded-lg'>
                        {isLoadingSearchLogs ||
                        (searchLogs &&
                          searchLogs.keywords.length === 0 &&
                          searchLogs.recently_search_list.length === 0) ? (
                          <Empty
                            className='cursor-default px-40'
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description='No users found'
                          />
                        ) : (
                          searchDebounce === '' && (
                            <>
                              <h1 className='font-bold text-lg mx-2'> Recently search</h1>
                              {searchLogs.recently_search_list.map((item) => (
                                <div
                                  className='userSearch flex gap-1.5 items-center cursor-pointer p-2 rounded-md'
                                  key={item._id}
                                  onClick={(e) => handleShowUserProfile(e, item._id)}>
                                  <div className='avatar'>
                                    <AvatarMessage key={item._id} user={item} />
                                  </div>
                                  <div
                                    className='name text-center ml-2'
                                    style={{
                                      fontSize: '0.9rem',
                                      color: themeColorSet.colorText1
                                    }}>
                                    {item.name}
                                  </div>
                                </div>
                              ))}
                              {searchLogs.keywords.map((item) => (
                                <div
                                  className='user flex gap-1.5 items-center cursor-pointer p-2 rounded-md z-50'
                                  onClick={() => getSearchPage(item)}>
                                  <div className='avatar relative'>
                                    <Avatar
                                      className='avatarButton cursor-pointer'
                                      icon={<SearchOutlined className='text-xl' />}
                                    />
                                  </div>
                                  <div
                                    className='name text-center ml-2'
                                    style={{
                                      fontSize: '0.9rem',
                                      color: themeColorSet.colorText1
                                    }}>
                                    Search for "{item}"
                                  </div>
                                </div>
                              ))}
                            </>
                          )
                        )}

                        {searchDebounce !== '' && (
                          <>
                            {users.map((item) => (
                              <div
                                className='userSearch flex gap-1.5 items-center cursor-pointer p-2 rounded-md'
                                key={item._id}
                                onClick={(e) => handleShowUserProfile(e, item._id)}>
                                <div className='avatar'>
                                  <AvatarMessage key={item._id} user={item} />
                                </div>
                                <div
                                  className='name text-center ml-2'
                                  style={{
                                    fontSize: '0.9rem',
                                    color: themeColorSet.colorText1
                                  }}>
                                  {item.name}
                                </div>
                              </div>
                            ))}
                            <div
                              className='user flex gap-1.5 items-center cursor-pointer p-2 rounded-md z-50'
                              onClick={() => getSearchPage(searchDebounce)}>
                              <div className='avatar relative'>
                                <Avatar
                                  className='avatarButton cursor-pointer'
                                  icon={<SearchOutlined className='text-xl' />}
                                />
                              </div>
                              <div
                                className='name text-center ml-2'
                                style={{
                                  fontSize: '0.9rem',
                                  color: themeColorSet.colorText1
                                }}>
                                Search for "{searchDebounce}"
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Col>

                  <Col span={5} className='pl-3 md:pl-0'>
                    <Space size={25}>
                      <NavLink to='/message'>
                        <Badge count={0}>
                          <Avatar
                            className='messageButton cursor-pointer'
                            icon={<CommentOutlined className='text-xl messageButton cursor-pointer' />}
                          />
                        </Badge>
                      </NavLink>
                      <Dropdown
                        arrow
                        menu={{
                          items: itemsNoti,
                          className: 'notiLayout',
                          style: {
                            maxHeight: '35rem',
                            overflow: 'auto'
                          }
                        }}
                        trigger={['click']}
                        placement='bottom'>
                        <Badge count={0}>
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
                          icon={<UserOutlined className='text-xl' />}
                        />
                      </Dropdown>
                      <DayNightSwitch checked={switchTheme} onChange={onChange} />
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Layout.Header>
        </StyleProvider>
      </Affix>
    </ConfigProvider>
  );
};

export default Headers;
