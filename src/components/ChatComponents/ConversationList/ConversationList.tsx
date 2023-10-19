import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Col, ConfigProvider, Input, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleProvider from './cssConversationList';
import { getTheme } from '@/util/theme';
import Avatar from '@/components/Avatar/AvatarMessage';
import ConversationBox from '@/components/ChatComponents/ConversationBox/ConversationBox';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { ConversationType } from '@/types';
import { PRIVATE_CONVERSATION } from '@/util/constants/SettingSystem';

interface ConversationListProps {
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  selected?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selected, setConversations }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const queryClient = useQueryClient();

  const { currentUserInfo } = useCurrentUserInfo();

  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { userID } = useAppSelector((state) => state.auth);

  useEffect(() => {
    chatSocket.on(PRIVATE_CONVERSATION + userID, (conversation: ConversationType) => {
      queryClient.setQueryData<ConversationType[]>(['conversations'], (old) => {
        if (!old) return [conversation];

        const index = old.findIndex((item) => item._id === conversation._id);
        if (index !== -1) {
          old[index].updatedAt = conversation.updatedAt;
          old.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
        } else {
          old.unshift(conversation);
        }
        setConversations([...old]);

        return [...old];
      });
    });
  }, [userID]);

  return (
    <StyleProvider theme={themeColorSet}>
      <Row className='searchChat'>
        <Col span={24}>
          <Row>
            <Space
              className='myInfo flex justify-between items-center py-4 px-3 w-full'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div className='flex'>
                <NavLink to={`/user/${currentUserInfo._id}`}>
                  <div className='avatar mr-3'>
                    <Avatar key={currentUserInfo._id} user={currentUserInfo} />
                  </div>
                </NavLink>
                <div className='name_career'>
                  <NavLink to={`/user/${currentUserInfo._id}`}>
                    <div
                      className='name mb-1'
                      style={{
                        color: themeColorSet.colorText1,
                        fontWeight: 600
                      }}>
                      {currentUserInfo.name}
                    </div>
                  </NavLink>
                  <div
                    className='career'
                    style={{
                      color: themeColorSet.colorText3
                    }}>
                    UX/UI Designer
                  </div>
                </div>
              </div>
              <div className='iconPlus cursor-pointer' onClick={() => {}}>
                <FontAwesomeIcon className='text-xl' icon={faUsersLine} color={themeColorSet.colorText1} />
              </div>
            </Space>
          </Row>
          <Row>
            <div
              className='searchInput pl-3 py-4 w-full flex justify-between items-center'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div className='input flex items-center w-full'>
                <div
                  className='iconSearch mr-2'
                  style={{
                    color: themeColorSet.colorText3
                  }}>
                  <SearchOutlined className='text-2xl' />
                </div>
                <ConfigProvider
                  theme={{
                    token: {
                      lineWidth: 0,
                      controlHeight: 40
                    }
                  }}>
                  <Input placeholder='Search' className='rounded-md' />
                </ConfigProvider>
              </div>
            </div>
          </Row>
          <Row>
            <div
              className='userChat w-full'
              style={{
                overflow: 'auto',
                maxHeight: 'calc(100vh - 160px)'
              }}>
              {conversations.map((conversation) => (
                <NavLink to={`/message/${conversation._id}`} key={conversation._id}>
                  <ConversationBox conversation={conversation} selected={conversation._id === selected} />
                </NavLink>
              ))}
            </div>
          </Row>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default ConversationList;
