
import { Col, ConfigProvider, Dropdown, Row, Space, Switch } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake, faComment, faUser, faBell, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';
import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons';
import { NavLink, useParams } from 'react-router-dom';

import ConversationList from '@/components/ChatComponents/ConversationList';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import LoadingChat from '@/components/Loading/LoadingChat';
import EmptyChat from '@/components/ChatComponents/EmptyChat';
import MessageChat from '@/components/ChatComponents/MessageChat';
import ContactList from '@/components/ChatComponents/ContactList';
import SharedMedia from '@/components/ChatComponents/SharedMedia';

import { useConversationsData, useCurrentConversationData, useFollowersData } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssChat';
import { setTheme } from '@/redux/Slice/ThemeSlice';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';
import { useMediaQuery } from 'react-responsive';

const Chat = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const { themeColorSet, themeColor } = getTheme();

  const { conversationID } = useParams();

  const { userID } = useAppSelector((state) => state.auth);

  const { conversations, isLoadingConversations } = useConversationsData();

  const { followers, isLoadingFollowers } = useFollowersData(userID!);

  const { isLoadingCurrentConversation } = useCurrentConversationData(conversationID);

  const [isDisplayShare, setIsDisplayShare] = useState(false);

  const dispatch = useAppDispatch();
  const change = (checked: boolean) => {
    if (checked) {
      dispatch(setTheme({ theme: DARK_THEME }));
    } else {
      dispatch(setTheme({ theme: LIGHT_THEME }));
    }
  };

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

  const [option, setOption] = useState(1);

  const changeOptions = (checked: number) => {
    switch (checked) {
      case 1:
        return (
          <ConversationList
            followers={followers!}
            initialItems={conversations || []}
            selected={conversationID}
          />
        );
      case 2:
        return <ContactList followers={followers!} />;
      case 3:
        console.log('3');
        break;
      case 4:
        console.log('4');
        break;
      default:
        break;
    }
  };

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleProvider theme={themeColorSet}>
        {isLoadingConversations && isLoadingFollowers ? (
          <LoadingChat />
        ) : (
          <div className='chat'>
            <Row className='h-screen slider'>
              <Col span={1} className='py-3 flex flex-col justify-between items-center'>
                <div>
                  <div className='logo items-center'>
                    <NavLink to='/' className='icon_logo'>
                      <FontAwesomeIcon className='icon' icon={faSnowflake} />
                    </NavLink>
                  </div>
                  <div className='option py-8 flex flex-col items-center'>
                    <Space size={35} direction='vertical' align='center'>
                      <div
                        className='message optionItem relative'
                        style={option == 1 ? { color: themeColorSet.colorText1 } : {}}>
                        <FontAwesomeIcon
                          className='icon text-2xl'
                          icon={faComment}
                          onClick={() => {
                            setOption(1);
                          }}
                        />
                        <span
                          className='absolute rounded-full bg-red-600 ring-1
                         ring-orange-50 top-4 -right-1 h-4 w-4 flex items-center 
                         justify-center text-xs text-gray-50'>
                          96
                        </span>
                      </div>
                      <div
                        className='contact optionItem relative'
                        style={option == 2 ? { color: themeColorSet.colorText1 } : {}}>
                        <FontAwesomeIcon
                          className='icon text-2xl'
                          icon={faUser}
                          onClick={() => {
                            setOption(2);
                          }}
                        />
                        <span
                          className='absolute rounded-full bg-red-600 ring-1
                         ring-orange-50 top-4 -right-1 h-4 w-4 flex items-center 
                         justify-center text-xs text-gray-50'>
                          69
                        </span>
                      </div>
                      <div
                        className='notification optionItem relative'
                        style={option == 3 ? { color: themeColorSet.colorText1 } : {}}>
                        <FontAwesomeIcon
                          className='icon text-2xl'
                          icon={faBell}
                          onClick={() => {
                            setOption(3);
                          }}
                        />
                        <span
                          className='absolute rounded-full bg-red-600 ring-1
                         ring-orange-50 top-4 -right-1 h-4 w-4 flex items-center 
                         justify-center text-xs text-gray-50'>
                          99
                        </span>
                      </div>
                      <div
                        className='voice-call optionItem relative'
                        style={option == 4 ? { color: themeColorSet.colorText1 } : {}}>
                        <FontAwesomeIcon
                          className='icon text-2xl'
                          icon={faPhone}
                          onClick={() => {
                            setOption(4);
                          }}
                        />
                        <span
                          className='absolute rounded-full bg-red-600 ring-1
                         ring-orange-50 top-4 -right-1 h-4 w-4 flex items-center 
                         justify-center text-xs text-gray-50'>
                          66
                        </span>
                      </div>
                    </Space>
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mode optionItem py-6'>
                    <FontAwesomeIcon
                      className='icon text-2xl'
                      icon={themeColorSet.colorPicker == 'light' ? faMoon : faSun}
                      onClick={() => {
                        change(themeColorSet.colorPicker == 'light' ? true : false);
                      }}
                    />
                  </div>
                  <div className='mode'>
                    <Dropdown menu={{ items: settingItem }} trigger={['click']}>
                      <div className='Setting optionItem'>
                        {/* <SettingOutlined className='text-3xl' /> */}
                        <FontAwesomeIcon className='icon text-3xl' icon={faGear} />
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </Col>
              <Col span={5}> {changeOptions(option)}</Col>
              <Col span={isDisplayShare ? 12 : 18}>
                <div
                  className='chatBox'
                  style={{
                    height: '99vh',
                    borderRight: isDisplayShare ? '1px solid' : 'none',
                    borderColor: themeColorSet.colorBg4
                  }}>
                  {!conversationID ? (
                    <EmptyChat key={Math.random()} />
                  ) : isLoadingCurrentConversation ? (
                    <LoadingConversation />
                  ) : (
                    <div style={{ height: '92%' }}>
                      <MessageChat
                        key={conversationID}
                        conversationID={conversationID}
                        setIsDisplayShare={setIsDisplayShare}
                        isDisplayShare={isDisplayShare}
                      />
                    </div>
                  )}
                </div>
              </Col>
              {isDisplayShare && <SharedMedia conversationID={conversationID!} />}
            </Row>
          </div>
        )}
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Chat;
