import { Col, ConfigProvider, Input, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleProvider from './cssContactList';
import { getTheme } from '@/util/theme';
import { messageService } from '@/services/MessageService';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';

interface ContactsListProps {
  followers: UserInfoType[];
}

const ConversationList = (Props: ContactsListProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const { themeColorSet, themeColor } = getTheme();

  const navigate = useNavigate();

  const HandleOnClick = async (userFollow: any) => {
    const { data } = await messageService.createConversation({
      type: 'private',
      members: [userFollow]
    });
    navigate(`/message/${data.metadata._id}`);
  };

  const handleItemName = (name: string) => {
    // chỉ lấy 2 từ cuối cùng của tên
    const arr = name.split(' ');
    return arr[arr.length - 2] + ' ' + arr[arr.length - 1];
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
            <div className='userActive px-3 w-full'>
              <div
                className='listUser flex mt-5'
                style={{
                  overflow: 'auto'
                }}>
                {Props.followers.map((item: any) => {
                  return (
                    <div
                      className='user flex items-center cursor-pointer'
                      key={item?._id}
                      onClick={() => HandleOnClick(item?._id)}>
                      <div className='avatar relative'>
                        <Avatar key={item?._id} user={item} />
                      </div>
                      <div
                        className='name text-center ml-2'
                        style={{
                          fontSize: '0.9rem',
                          color: themeColorSet.colorText1
                        }}>
                        {/* {handleItemName(item?.name)} */}
                        {item?.name}
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

export default ConversationList;
