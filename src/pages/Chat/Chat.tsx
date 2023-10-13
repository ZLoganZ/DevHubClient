import { Col, ConfigProvider, Dropdown, Row, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { CommentOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink, useParams } from 'react-router-dom';

import ConversationList from '@/components/ChatComponents/ConversationList';
import LoadingConversation from '@/components/Loading/LoadingConversation';
import LoadingChat from '@/components/Loading/LoadingChat';
import EmptyChat from '@/components/ChatComponents/EmptyChat';
import MessageChat from '@/components/ChatComponents/MessageChat';
import InputChat from '@/components/ChatComponents/InputChat';
import SharedMedia from '@/components/ChatComponents/SharedMedia';

import { useConversationsData, useCurrentConversationData, useFollowersData } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssChat';
import { setTheme } from '@/redux/Slice/ThemeSlice';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';

const Chat = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet, themeColor } = getTheme();

  const { conversationID } = useParams();

  const { userID } = useAppSelector((state) => state.auth);

  const { conversations, isLoadingConversations } = useConversationsData();

  const { followers, isLoadingFollowers } = useFollowersData(userID!);

  const { isLoadingCurrentConversation } = useCurrentConversationData(
    conversationID ? conversationID : undefined
  );

  const [isDisplayShare, setIsDisplayShare] = useState(false);

  const dispatch = useAppDispatch();
  const onChange = (checked: boolean) => {
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
          <FontAwesomeIcon className='icon' icon={faSun} />
          <span className='ml-2'>Light theme</span>
        </div>
      ),
      onClick: () => {
        onChange(false);
      }
    },
    {
      key: '2',
      label: (
        <div className='item flex items-center px-4 py-2'>
          <FontAwesomeIcon className='icon' icon={faSnowflake} />
          <span className='ml-2'>Dark theme</span>
        </div>
      ),
      onClick: () => {
        onChange(true);
      }
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleProvider theme={themeColorSet}>
        {isLoadingFollowers ? (
          <LoadingChat />
        ) : (
          <div className='chat flex'>
            <div
              className='slider flex flex-col justify-between items-center h-screen py-3'
              style={{
                width: '5%',
                borderRight: '1px solid',
                borderColor: themeColorSet.colorBg4,
                position: 'fixed',
                backgroundColor: themeColorSet.colorBg1
              }}>
              <div className='logo flex flex-col items-center'>
                <NavLink to='/' className='icon_logo'>
                  <FontAwesomeIcon className='icon' icon={faSnowflake} />
                </NavLink>
                <div className='option py-6'>
                  <Space size={30} direction='vertical'>
                    <div className='message optionItem'>
                      <CommentOutlined className='text-2xl' />
                    </div>
                    <div className='Search optionItem'>
                      <SearchOutlined className='text-2xl' />
                    </div>
                  </Space>
                </div>
              </div>
              <div className='mode '>
                <Dropdown menu={{ items: settingItem }} trigger={['click']}>
                  <div className='Setting optionItem'>
                    <SettingOutlined className='text-2xl' />
                  </div>
                </Dropdown>
              </div>
            </div>
            <div
              className='insteadComponent'
              style={{
                marginLeft: '5%',
                width: '23%',
                height: '100vh',
                position: 'fixed',
                borderRight: '1px solid',
                borderColor: themeColorSet.colorBg4
              }}>
              <ConversationList
                followers={followers!}
                initialItems={conversations}
                selected={conversationID}
              />
            </div>
            <div
              className='chatBox'
              style={{
                width: isDisplayShare ? '49%' : '72%',
                marginLeft: '28%',
                height: '100vh',
                position: 'fixed',
                backgroundColor: themeColorSet.colorBg1,
                borderRight: isDisplayShare ? '1px solid' : 'none',
                borderColor: themeColorSet.colorBg4
              }}>
              {!conversationID ? (
                <EmptyChat key={Math.random()} />
              ) : isLoadingCurrentConversation ? (
                <LoadingConversation />
              ) : (
                <>
                  <div style={{ height: '92%' }}>
                    <MessageChat
                      // key={conversations[0]?.lastMessageAt}
                      key={conversationID}
                      conversationID={conversationID}
                      setIsDisplayShare={setIsDisplayShare}
                      isDisplayShare={isDisplayShare}
                    />
                  </div>
                  <InputChat conversationID={conversationID} />
                </>
              )}
            </div>
            {isDisplayShare ? <SharedMedia key={conversationID} conversationID={conversationID!} /> : <></>}
          </div>
        )}
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Chat;
