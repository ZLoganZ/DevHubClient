import { useEffect, useState } from 'react';
import {
  faCaretDown,
  faCaretRight,
  faDownload,
  faEllipsisVertical,
  faImage,
  faPen,
  faPlusCircle,
  faRightFromBracket,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, Space, Empty, Skeleton, Col, Row, MenuProps, Dropdown, Collapse, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';

import StyleProvider from './cssSharedMedia';
import { useCurrentConversationData } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { useAppSelector, useOtherUser } from '@/hooks/special';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
interface SharedMediaProps {
  conversationID: string;
}

const SharedMedia = (Props: SharedMediaProps) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { isLoadingCurrentConversation, currentConversation } = useCurrentConversationData(
    Props.conversationID
  );

  const otherUser = useOtherUser(currentConversation);

  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    if (isLoadingCurrentConversation) return;

    setItems(currentConversation.image);
  }, [isLoadingCurrentConversation, currentConversation]);

  const memberOptions: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className='item flex items-center'>
          <span className=''>Promote to Admin</span>
        </div>
      ),
      icon: <FontAwesomeIcon icon={faUserShield} />
    },
    {
      key: '2',
      label: (
        <div className='item flex items-center'>
          <span className=''>Remove member</span>
        </div>
      ),
      danger: true,
      icon: <FontAwesomeIcon icon={faRightFromBracket} />
    }
  ];

  const downloadImage = async (url: any) => {
    const originalImage = url;
    const image = await fetch(originalImage);

    //Split image name
    const nameSplit = originalImage.split('/');
    const duplicateName = nameSplit.pop();
    const name = duplicateName.substring(0, duplicateName.lastIndexOf('_'));

    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = '' + name + '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const listImages = (items: any) => {
    return (
      <div className='content'>
        {items == null ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            {items?.map((item: any, index: any) => {
              if (index > 3) return;
              return (
                <div className='fileContent flex justify-between items-center mb-2 ml-2'>
                  <div className='left flex justify-between items-center'>
                    <div className='image mr-2'>
                      <Image
                        key={item._id}
                        src={item.image}
                        alt='image'
                        style={{
                          height: '3.5rem',
                          borderRadius: '10px',
                          width: '3.5rem',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <Space className='info' direction='vertical'>
                      <div
                        className='name'
                        style={{
                          color: themeColorSet.colorText1,
                          fontWeight: '600'
                        }}>
                        {item.sender.name}
                      </div>
                      <Space
                        style={{
                          color: themeColorSet.colorText3
                        }}>
                        <div className='date'>{formatDateTime(item.createdAt)}</div>
                      </Space>
                    </Space>
                  </div>
                  <div
                    className='right cursor-pointer'
                    onClick={() => {
                      downloadImage(item.image);
                    }}>
                    <FontAwesomeIcon icon={faDownload} />
                  </div>
                </div>
              );
            })}
            <div
              className='seeAll flex items-end justify-end'
              style={{
                color: themeColorSet.colorText2,
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}>
              <p className='cursor-pointer'>See all</p>
            </div>
          </>
        )}
      </div>
    );
  };

  const listMembers = (currentConversation: any) => {
    return (
      <div className='pr-5 w-full'>
        <div
          className='listUser flex flex-col w-full pl-3'
          style={{
            overflow: 'auto'
          }}>
          {currentConversation.members.map((item: any) => {
            return (
              <div className='mt-3 w-full flex flex-row justify-between items-center'>
                <div className='user flex items-center' key={item._id}>
                  <div className='avatar-member relative cursor-pointer'>
                    <Avatar key={item._id} user={item} />
                  </div>
                  <div
                    className='name flex flex-col text-left ml-2'
                    style={{
                      fontSize: '0.9rem',
                      color: themeColorSet.colorText1
                    }}>
                    {item.name}
                    <div className='text-xs'>admin</div>
                  </div>
                </div>
                <div className='options rounded-full'>
                  <Dropdown menu={{ items: memberOptions }} trigger={['click']}>
                    <FontAwesomeIcon
                      className='text-lg cursor-pointer py-1 px-3 '
                      icon={faEllipsisVertical}
                    />
                  </Dropdown>
                </div>
              </div>
            );
          })}
        </div>
        <div className='add-member mt-3 w-full flex flex-row cursor-pointer pl-3 pr-5 py-2 rounded-full'>
          <FontAwesomeIcon className='text-2xl' icon={faPlusCircle} />
          <div
            className='name flex flex-col text-left ml-2'
            style={{
              fontSize: '0.9rem',
              color: themeColorSet.colorText1
            }}>
            Add members
          </div>
        </div>
      </div>
    );
  };

  const listOptions: CollapseProps['items'] = [
    {
      key: 0,
      label: <span className='text-base font-semibold'>Conversation setting</span>,
      children: (
        <Space className='conversation-setting ml-3' direction='vertical' size={10}>
          <div
            className='rename cursor-pointer rounded-full flex items-center'
            style={{
              color: themeColorSet.colorText1
            }}>
            <FontAwesomeIcon className='text-lg mr-2' icon={faPen} />
            Change name
          </div>
          <div
            className='change-image cursor-pointer rounded-full flex items-center'
            style={{
              color: themeColorSet.colorText1
            }}>
            <FontAwesomeIcon className='text-lg mr-2' icon={faImage} />
            Change image
          </div>
        </Space>
      )
    },
    {
      key: '1',
      label: <span className='text-base font-semibold'>Images</span>,
      children: listImages(items)
    },
    {
      key: '2',
      label: <span className='text-base font-semibold'>Files</span>,
      children: <div className='content'></div>
    },
    {
      key: '3',
      label: <span className='text-base font-semibold'>Links</span>,
      children: <div className='content'></div>
    },
    {
      key: '4',
      label: <span className='text-base font-semibold'>Audio</span>,
      children: <div className='content'></div>
    },
    {
      key: '5',
      label: <span className='text-base font-semibold'>Members</span>,
      children: listMembers(currentConversation)
    },
    {
      key: '6',
      label: <span className='text-base font-semibold'>Private & Supports</span>,
      children: (
        <div className='leave-group w-full flex flex-row items-center cursor-pointer pl-3 pr-3 py-2 rounded-full'>
          <FontAwesomeIcon className='text-xl' icon={faRightFromBracket} />
          <div
            className='name flex flex-col text-left ml-2'
            style={{
              fontSize: '0.9rem',
              color: themeColorSet.colorText1
            }}>
            Leave group
          </div>
        </div>
      )
    }
  ];

  if (currentConversation.type !== 'group') {
    listOptions.splice(
      listOptions.findIndex((item) => {
        return item.key === '5';
      }),
      1
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerPadding: '8px 12px',
            contentPadding: '0px 12px'
          }
        }
      }}>
      <StyleProvider theme={themeColorSet}>
        {isLoadingCurrentConversation ? (
          <>
            <div
              className='shared'
              style={{
                width: '25%',
                height: '91%',
                position: 'fixed',
                backgroundColor: themeColorSet.colorBg1
              }}>
              <div
                className='extension px-3 flex items-center'
                style={{
                  height: '13%'
                }}>
                <div className='flex justify-center items-center w-full'>
                  <div
                    className='setting text-center'
                    style={{
                      width: '25%'
                    }}>
                    <Skeleton.Button active size='large' shape='circle' />
                  </div>
                  <div
                    className='notification text-center'
                    style={{
                      width: '25%'
                    }}>
                    <Skeleton.Button active size='large' shape='circle' />
                  </div>
                  <div
                    className='warning text-center'
                    style={{
                      width: '25%'
                    }}>
                    <Skeleton.Button active size='large' shape='circle' />
                  </div>
                  <div
                    className='logout text-center'
                    style={{
                      width: '25%'
                    }}>
                    <Skeleton.Button active size='large' shape='circle' />
                  </div>
                </div>
              </div>
              <div className='fileShare px-3 py-4'>
                <div className='sharedMedia'>
                  <Space className='content' size={20}>
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                  </Space>
                </div>
                <div className='sharedFile mt-5'>
                  <div className='flex justify-between items-center mb-3'></div>
                  <div className='content'>
                    <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                    <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                    <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                    <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                    <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                    <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className='shared h-full overflow-auto'
            style={{
              borderLeft: '1px solid ' + themeColorSet.colorText3,
              backgroundColor: themeColorSet.colorBg1
            }}>
            <Col className='info h-full'>
              <Row className='mt-4' align='middle' justify='center'>
                <Space size={10} direction='vertical' align='center'>
                  <div className='avatar'>
                    {currentConversation.type === 'group' ? (
                      <AvatarGroup
                        key={currentConversation._id}
                        users={currentConversation.members}
                        image={currentConversation.image}
                        size={80}
                      />
                    ) : (
                      <Avatar key={otherUser._id} user={otherUser} size={80} />
                    )}
                  </div>
                  <div className='name'>
                    <span className='font-semibold text-xl'>
                      {currentConversation.name ?? otherUser.name}
                    </span>
                  </div>
                </Space>
              </Row>
              <Row className='mt-2' justify='center'>
                <Space size={20} direction='horizontal' align='center'>
                  <SearchOutlined className='text-2xl cursor-pointer' />
                </Space>
              </Row>

              <Collapse
                items={listOptions}
                ghost
                expandIconPosition='end'
                expandIcon={({ isActive }) => (
                  <FontAwesomeIcon icon={isActive ? faCaretDown : faCaretRight} />
                )}
              />
            </Col>
          </div>
        )}
      </StyleProvider>
    </ConfigProvider>
  );
};

export default SharedMedia;
