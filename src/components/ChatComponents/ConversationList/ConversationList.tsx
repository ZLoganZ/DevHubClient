import { useEffect, useState } from 'react';
import { Col, ConfigProvider, Empty, Input, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleProvider from './cssConversationList';
import { getTheme } from '@/util/theme';
import Avatar from '@/components/Avatar/AvatarMessage';
import ConversationBox from '@/components/ChatComponents/ConversationBox/ConversationBox';
import OpenGroupModal from '@/components/OpenGroupModal';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { ConversationType } from '@/types';
import { PRIVATE_CONVERSATION } from '@/util/constants/SettingSystem';
import { useReceiveConversation } from '@/hooks/mutation';

interface ConversationListProps {
  conversations: ConversationType[];
  selected?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selected }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();

  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { userID } = useAppSelector((state) => state.auth);
  const { visible } = useAppSelector((state) => state.modalHOC);

  const { mutateReceiveConversation } = useReceiveConversation();

  const [search, setSearch] = useState('');
  const [searchConversation, setSearchConversation] = useState<ConversationType[]>(conversations);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!visible && isOpenModal) {
      setIsOpenModal(false);
    }
  }, [visible]);

  useEffect(() => {
    chatSocket.on(PRIVATE_CONVERSATION + userID, (conversation: ConversationType) => {
      mutateReceiveConversation(conversation);
    });
  }, [userID]);

  useEffect(() => {
    if (search === '') {
      setSearchConversation(conversations);
    } else {
      const searchTerm = removeAccents(search).toLowerCase();

      setSearchConversation(
        conversations.filter((conversation) => {
          if (conversation.type === 'group') {
            const name = removeAccents(conversation.name);
            return name.toLowerCase().includes(searchTerm);
          } else {
            const otherUser = conversation.members.filter((member) => member._id !== currentUserInfo._id)[0];

            const name = removeAccents(otherUser.name);
            return name.toLowerCase().includes(searchTerm);
          }
        })
      );
    }
  }, [search]);

  const removeAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  return (
    <StyleProvider theme={themeColorSet}>
      {isOpenModal && <OpenGroupModal users={currentUserInfo.members} />}
      <Row className='searchChat'>
        <Col span={24}>
          <Row>
            <Space
              className='myInfo flex justify-between items-center py-4 px-3 w-full'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div className='flex justify-between items-center'>
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
                    {currentUserInfo.experiences[0]?.position_name}
                  </div>
                </div>
              </div>
              <div
                className='iconPlus cursor-pointer'
                onClick={() => {
                  setIsOpenModal(!isOpenModal);
                }}>
                <FontAwesomeIcon className='text-xl' icon={faUsersLine} color={themeColorSet.colorText1} />
              </div>
            </Space>
          </Row>
          <Row>
            <div
              className='searchInput py-4 px-2 w-full flex justify-between items-center'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div className='input flex items-center w-full '>
                <ConfigProvider
                  theme={{
                    token: {
                      lineWidth: 0,
                      controlHeight: 40
                    }
                  }}>
                  <Input
                    allowClear
                    placeholder='Search conversation'
                    className='rounded-full mx-0'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    prefix={<SearchOutlined className='text-2xl' />}
                  />
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
              <div className='userChatContact'>
                {searchConversation.length === 0 ? (
                  <Empty
                    image='https://cdn.iconscout.com/icon/free/png-256/free-empty-folder-2702275-2244989.png'
                    description={<p style={{ color: themeColorSet.colorText3 }}>No conversation found</p>}
                    imageStyle={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  />
                ) : (
                  searchConversation.map((conversation) => (
                    <ConversationBox
                      key={conversation._id}
                      conversation={conversation}
                      selected={conversation._id === selected}
                    />
                  ))
                )}
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default ConversationList;
