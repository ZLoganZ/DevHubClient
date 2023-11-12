import { useEffect, useState } from 'react';
import { Col, ConfigProvider, Empty, Input, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleProvider from './cssConversationList';
import { getTheme } from '@/util/theme';
import AvatarMessage from '@/components/ChatComponents/Avatar/AvatarMessage';
import ConversationBox from '@/components/ChatComponents/ConversationBox/ConversationBox';
import CreateGroupChat from '@/components/ChatComponents/OpenModal/CreateGroupChat';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { IConversation, IMessage } from '@/types';
import { Socket } from '@/util/constants/SettingSystem';
import {
  useMutateConversation,
  useReceiveConversation,
  useReceiveLeaveGroup,
  useReceiveMessage,
  useReceiveSeenConversation
} from '@/hooks/mutation';

interface IConversationList {
  conversations: IConversation[];
  selecting?: string;
}

const ConversationList: React.FC<IConversationList> = ({ conversations, selecting: selected }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { theme } = useAppSelector((state) => state.theme);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();

  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { visible } = useAppSelector((state) => state.modalHOC);

  const { mutateReceiveConversation } = useReceiveConversation();
  const { mutateReceiveLeaveGroup } = useReceiveLeaveGroup();
  const { mutateReceiveSeenConversation } = useReceiveSeenConversation();
  const { mutateReceiveMessage } = useReceiveMessage(currentUserInfo._id, selected);
  const { mutateConversation } = useMutateConversation(currentUserInfo._id);

  const [search, setSearch] = useState('');
  const [searchConversation, setSearchConversation] = useState<IConversation[]>(conversations);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!visible && isOpenModal) {
      setIsOpenModal(false);
    }
  }, [visible]);

  useEffect(() => {
    setSearchConversation(conversations);
  }, [conversations]);

  useEffect(() => {
    chatSocket.on(Socket.PRIVATE_CONVERSATION, (conversation: IConversation) => {
      mutateReceiveConversation(conversation);
    });
    chatSocket.on(Socket.LEAVE_GROUP, (conversation: IConversation) => {
      mutateReceiveLeaveGroup(conversation);
    });
    chatSocket.on(Socket.PRIVATE_MSG, (message: IMessage) => {
      mutateReceiveMessage(message);
    });
    chatSocket.on(Socket.SEEN_MSG, (conversation: IConversation) => {
      mutateReceiveSeenConversation(conversation);
    });
    chatSocket.on(Socket.CHANGE_CONVERSATION_IMAGE, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'image' });
    });
    chatSocket.on(Socket.CHANGE_CONVERSATION_COVER, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'cover_image' });
    });
    chatSocket.on(Socket.CHANGE_CONVERSATION_NAME, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'name' });
    });
    chatSocket.on(Socket.ADD_MEMBER, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'add_member' });
    });
    chatSocket.on(Socket.REMOVE_MEMBER, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'remove_member' });
    });
    chatSocket.on(Socket.COMMISSION_ADMIN, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'commission_admin' });
    });
    chatSocket.on(Socket.DECOMMISSION_ADMIN, (conversation: IConversation) => {
      mutateConversation({ ...conversation, typeUpdate: 'remove_admin' });
    });
  }, []);

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
      {isOpenModal && <CreateGroupChat users={currentUserInfo.members} />}
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
                    <AvatarMessage key={currentUserInfo._id} user={currentUserInfo} />
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
                <ConfigProvider theme={{ token: { lineWidth: 0, controlHeight: 40 } }}>
                  <Input
                    allowClear
                    placeholder='Search'
                    className='rounded-full '
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    prefix={<SearchOutlined className='text-xl mr-1' />}
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
                    image='https://cdn.iconscout.com/icon/premium/png-512-thumb/no-message-4173048-3453755.png'
                    description={
                      <p className='text-sm' style={{ color: themeColorSet.colorText2 }}>
                        No conversation found
                      </p>
                    }
                    imageStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      filter: theme === 'dark' ? 'invert(1)' : 'invert(0)'
                    }}
                  />
                ) : (
                  <div className='ps-2'>
                    {searchConversation.map((conversation) => (
                      <ConversationBox
                        key={conversation._id}
                        conversation={conversation}
                        selected={conversation._id === selected}
                      />
                    ))}
                  </div>
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
