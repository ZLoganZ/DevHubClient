import { Col, ConfigProvider, Input, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import StyleProvider from './cssConversationList';
import { getTheme } from '@/util/theme';
import { messageService } from '@/services/MessageService';
import Avatar from '@/components/Avatar/AvatarMessage';
import ConversationBox from '@/components/ChatComponents/ConversationBox/ConversationBox';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { ConversationType, UserInfoType } from '@/types';

interface ConversationListProps {
  conversations: ConversationType[];
  selected?: string;
  followers: UserInfoType[];
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selected, followers }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const navigate = useNavigate();

  const { currentUserInfo } = useCurrentUserInfo();

  const HandleOnClick = async (userFollow: string) => {
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
      <Row className='searchChat'>
        <Col span={24}>
          <Row>
            <Space
              className='myInfo flex justify-between items-center py-4 px-3 w-full'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div className='flex'>
                <NavLink to={`/user/${currentUserInfo?._id}`}>
                  <div className='avatar mr-3'>
                    <Avatar key={currentUserInfo?._id} user={currentUserInfo} />
                  </div>
                </NavLink>
                <div className='name_career'>
                  <NavLink to={`/user/${currentUserInfo?._id}`}>
                    <div
                      className='name mb-1'
                      style={{
                        color: themeColorSet.colorText1,
                        fontWeight: 600
                      }}>
                      {currentUserInfo?.name}
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
              {Props.initialItems?.length > 0 &&
                Props.initialItems.map((item: any) => (
                  <NavLink to={`/message/${item?._id}`} key={item?._id}>
                    <ConversationBox data={item} selected={item?._id === Props?.selected} />
                  </NavLink>
                ))}
            </div>

          </Row>
        </Col>
      </Row>

            <ConfigProvider
              theme={{
                token: {
                  lineWidth: 0,
                  controlHeight: 40,
                  borderRadius: 0
                }
              }}>
              <Input placeholder='Search' className='mr-4' />
            </ConfigProvider>
          </div>
        </div>
        <div
          className='userActive px-3 py-4 w-full'
          style={{
            borderBottom: '1px solid',
            borderColor: themeColorSet.colorBg4,
            height: '27%'
          }}>
          <div
            className='title'
            style={{
              fontWeight: 600,
              color: themeColorSet.colorText1
            }}>
            People
          </div>
          <div
            className='listUser flex mt-5'
            style={{
              overflow: 'auto'
            }}>
            {followers.map((item) => {
              return (
                <div
                  className='user flex flex-col items-center cursor-pointer w-1/2 mt-5'
                  key={item._id}
                  onClick={() => HandleOnClick(item._id)}>
                  <div className='avatar relative'>
                    <Avatar key={item._id} user={item} />
                  </div>
                  <div
                    className='name text-center mt-2'
                    style={{
                      fontSize: '0.9rem',
                      color: themeColorSet.colorText1
                    }}>
                    {handleItemName(item.name)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className='userChat'
          style={{
            height: '57%',
            overflow: 'auto'
          }}>
          {conversations.length > 0 &&
            conversations.map((item) => (
              <NavLink to={`/message/${item._id}`} key={item._id}>
                <ConversationBox data={item} selected={item._id === selected} />
              </NavLink>
            ))}
        </div>
        <div className='listUser'></div>
      </div>

    </StyleProvider>
  );
};

export default ConversationList;
