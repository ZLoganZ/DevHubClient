import { Col, ConfigProvider, Empty, Input, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import { getTheme } from '@/util/theme';
import { NEW_CONVERSATION } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { useReceiveConversation } from '@/hooks/mutation';
import { UserInfoType } from '@/types';
import StyleProvider from './cssContactList';

interface IContactsList {
  followers: UserInfoType[];
}

const ConversationList: React.FC<IContactsList> = ({ followers }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { theme } = useAppSelector((state) => state.theme);
  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { mutateReceiveConversation } = useReceiveConversation();

  const { themeColorSet } = getTheme();

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchFollowers, setSearchFollowers] = useState<UserInfoType[]>(followers);

  const HandleOnClick = (userFollow: string) => {
    void messageService
      .createConversation({
        type: 'private',
        members: [userFollow]
      })
      .then((res) => {
        chatSocket.emit(NEW_CONVERSATION, res.data.metadata);
        mutateReceiveConversation(res.data.metadata);
        navigate(`/message/${res.data.metadata._id}`);
      });
  };

  useEffect(() => {
    setSearchFollowers(followers);
  }, [followers]);

  useEffect(() => {
    if (search === '') {
      setSearchFollowers(followers);
    } else {
      const searchTerm = removeAccents(search).toLowerCase();

      setSearchFollowers(
        followers.filter((follower) => {
          const name = removeAccents(follower.name).toLowerCase();
          return name.includes(searchTerm);
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
      <Row className='contacts'>
        <Col span={24}>
          <Row>
            <Space
              className='myInfo flex justify-between items-center py-4 px-3 w-full'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div
                className='text-2xl'
                style={{
                  color: themeColorSet.colorText1
                }}>
                Contacts
              </div>
              <div className='iconPlus cursor-pointer' onClick={() => {}}>
                <FontAwesomeIcon
                  className='text-sm rounded-lg'
                  icon={faUserPlus}
                  color={themeColorSet.colorText1}
                />
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
                    prefix={<SearchOutlined className='text-xl' />}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </ConfigProvider>
              </div>
            </div>
          </Row>
          <Row>
            <div className='userActive px-3 w-full'>
              <div
                className='listUser flex flex-col'
                style={{
                  overflow: 'auto'
                }}>
                {searchFollowers.length === 0 ? (
                  <Empty
                    image='https://static.thenounproject.com/png/3668369-200.png'
                    description={
                      <p className='text-sm' style={{ color: themeColorSet.colorText2 }}>
                        No contact found
                      </p>
                    }
                    imageStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      filter: theme === 'dark' ? 'invert(1)' : 'invert(0)'
                    }}
                  />
                ) : (
                  searchFollowers.map((item) => {
                    return (
                      <div
                        className='user flex items-center cursor-pointer mt-5'
                        key={item._id}
                        onClick={() => HandleOnClick(item._id)}>
                        <div className='avatar relative'>
                          <Avatar key={item._id} user={item} />
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
                    );
                  })
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
