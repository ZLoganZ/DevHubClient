import { Col, ConfigProvider, Input, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleProvider from './cssContactList';
import { getTheme } from '@/util/theme';
import { messageService } from '@/services/MessageService';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';

interface IContactsList {
  followers: UserInfoType[];
}

const ContactList: React.FC<IContactsList> = ({ followers }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const { themeColorSet } = getTheme();

  const navigate = useNavigate();

  const HandleOnClick = (userFollow: string) => {
    void messageService
      .createConversation({
        type: 'private',
        members: [userFollow]
      })
      .then((res) => {
        navigate(`/message/${res.data.metadata._id}`);
      });
  };

  // const handleItemName = (name: string) => {
  //   // chỉ lấy 2 từ cuối cùng của tên
  //   const arr = name.split(' ');
  //   return arr[arr.length - 2] + ' ' + arr[arr.length - 1];
  // };

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
                    placeholder='Search conversation'
                    className='rounded-full mx-0'
                    prefix={<SearchOutlined className='text-2xl' />}
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
                {followers.map((item) => {
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
                        {/* {handleItemName(item?.name)} */}
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default ContactList;
