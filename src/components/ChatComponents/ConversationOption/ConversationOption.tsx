import { useEffect, useState } from 'react';
import {
  IconDefinition,
  faCaretRight,
  faCommentDots,
  faDownload,
  faEllipsisVertical,
  faImage,
  faLink,
  faPen,
  faPlusCircle,
  faRightFromBracket,
  faShieldHalved,
  faUser,
  faUserShield,
  faUserSlash
} from '@fortawesome/free-solid-svg-icons';
import {
  faFileAudio as faReFileAudio,
  faFolderOpen as faReFolderOpen,
  faImages as faReImages
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Image,
  Space,
  Empty,
  Skeleton,
  Col,
  Row,
  MenuProps,
  Dropdown,
  Collapse,
  ConfigProvider,
  Tooltip
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useCurrentConversationData, useCurrentUserInfo } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { useAppSelector, useOtherUser } from '@/hooks/special';
import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import ChangeAvatarGroup from '@/components/ChatComponents/OpenModal/ChangeAvatarGroup';
import { ConversationType, MessageType } from '@/types';
import StyleProvider from './cssConversationOption';

interface IConversationOption {
  conversationID: string;
}

const ConversationOption: React.FC<IConversationOption> = ({ conversationID }) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { visible } = useAppSelector((state) => state.modalHOC);

  const navigate = useNavigate();

  const { currentUserInfo } = useCurrentUserInfo();
  const { isLoadingCurrentConversation, currentConversation } = useCurrentConversationData(conversationID);

  const otherUser = useOtherUser(currentConversation);

  const [images, setImages] = useState<any>([]);
  const [openAvatar, setOpenAvatar] = useState(false);

  useEffect(() => {
    if (!visible && openAvatar) {
      setOpenAvatar(false);
    }
  }, [visible]);

  const memberOptions = (userID: string): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: 'Commission as administrator',
        icon: <FontAwesomeIcon icon={faUserShield} />,
        style: {
          display:
            !currentConversation.admins?.some((admin) => admin._id === userID) &&
            currentConversation.admins?.some((admin) => admin._id === currentUserInfo._id)
              ? ''
              : 'none'
        }
      },
      {
        key: '3',
        label: 'Message',
        icon: <FontAwesomeIcon icon={faCommentDots} />,
        style: {
          display: userID === currentUserInfo._id ? 'none' : ''
        }
      },
      {
        label: 'View profile',
        key: '4',
        icon: <FontAwesomeIcon icon={faUser} />,
        onClick: () => {
          navigate(`/user/${otherUser._id}`);
        }
      },
      {
        type: 'divider',
        style: {
          display:
            currentConversation.admins?.some((admin) => admin._id === userID) &&
            userID !== currentUserInfo._id
              ? 'none'
              : ''
        }
      },
      {
        key: '2',
        label:
          currentConversation.admins?.some((admin) => admin._id === currentUserInfo._id) &&
          userID === currentUserInfo._id
            ? 'Leave group'
            : 'Remove member',
        danger: true,
        icon:
          currentConversation.admins?.some((admin) => admin._id === currentUserInfo._id) &&
          userID === currentUserInfo._id ? (
            <FontAwesomeIcon className='text-xl' icon={faRightFromBracket} />
          ) : (
            <FontAwesomeIcon icon={faUserSlash} />
          ),
        style: {
          display:
            currentConversation.admins?.some((admin) => admin._id === userID) &&
            userID !== currentUserInfo._id
              ? 'none'
              : ''
        }
      }
    ];
  };

  const downloadImage = async (url: string) => {
    const originalImage = url;
    const image = await fetch(originalImage);

    //Split image name
    const nameSplit = originalImage.split('/');
    const duplicateName = nameSplit.pop();
    const name = duplicateName?.substring(0, duplicateName.lastIndexOf('_'));

    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = '' + name + '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const listItems = (items: any, icon: IconDefinition, description: string) => {
    return (
      <div className='content'>
        {items.length === 0 ? (
          <Empty
            image={<FontAwesomeIcon icon={icon} />}
            description={
              <p className='text-sm' style={{ color: themeColorSet.colorText3 }}>
                {description}
              </p>
            }
          />
        ) : (
          <>
            {items?.slice(0, 4).map((item: any, index: number) => (
              <div className='fileContent flex justify-between items-center mb-2 ml-2' key={index}>
                <div className='left flex justify-between items-center'>
                  <div className='image mr-2'>
                    <Image
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
                      <div className='date'>{getDateTimeToNow(item.createdAt)}</div>
                    </Space>
                  </Space>
                </div>
                <div
                  className='right cursor-pointer'
                  onClick={() => {
                    void downloadImage(item.image);
                  }}>
                  <FontAwesomeIcon icon={faDownload} />
                </div>
              </div>
            ))}
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

  const listImages = (items: MessageType[]) => {
    return listItems(items, faReImages, 'No images');
  };

  const listFiles = (items: any) => {
    return listItems(items, faReFolderOpen, 'No files');
  };

  const listLinks = (items: any) => {
    return listItems(items, faLink, 'No links');
  };

  const listAudio = (items: any) => {
    return listItems(items, faReFileAudio, 'No audio');
  };

  const listMembers = (currentConversation: ConversationType) => {
    return (
      <div className='pr-5 w-full'>
        <div className='listUser flex flex-col w-full pl-3' style={{ overflow: 'auto' }}>
          {currentConversation.members.map((member) => {
            return (
              <div key={member._id} className='mt-3 w-full flex flex-row justify-between items-center'>
                <div className='user flex items-center' key={member._id}>
                  <Tooltip
                    arrow
                    title={`Message ${member.name}`}
                    overlayInnerStyle={{
                      borderRadius: '0.55rem',
                      backgroundColor: themeColorSet.colorBgReverse3,
                      color: themeColorSet.colorTextReverse2,
                      fontWeight: 500
                    }}
                    mouseEnterDelay={0.2}
                    autoAdjustOverflow>
                    <div className='avatar-member relative cursor-pointer'>
                      <Avatar key={member._id} user={member} />
                    </div>
                  </Tooltip>
                  <div
                    className='name flex flex-col text-left ml-2'
                    style={{
                      fontSize: '0.9rem',
                      color: themeColorSet.colorText1
                    }}>
                    <div>
                      {member.name}
                      {currentConversation.admins?.some((admin) => admin._id === member._id) && (
                        <FontAwesomeIcon className='ml-1' icon={faShieldHalved} />
                      )}
                    </div>

                    {currentConversation.admins?.some((admin) => admin._id === member._id) && (
                      <div className='text-xs'>Admin</div>
                    )}
                  </div>
                </div>
                <div className='options rounded-full'>
                  <Dropdown menu={{ items: memberOptions(member._id) }} trigger={['click']}>
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
          <div className='name flex items-center text-sm font-medium text-left ml-2'>Add members</div>
        </div>
      </div>
    );
  };

  const listOptions: CollapseProps['items'] = [
    {
      key: 0,
      label: <span className='text-base font-semibold'>Conversation setting</span>,
      children: (
        <>
          <div className='rename w-full flex flex-row items-center cursor-pointer px-3 py-2 rounded-full'>
            <FontAwesomeIcon className='text-lg mr-2' icon={faPen} />
            Change name
          </div>
          <div
            className='change-image w-full flex flex-row items-center cursor-pointer px-3 py-2 rounded-full'
            onClick={() => setOpenAvatar(!openAvatar)}>
            <FontAwesomeIcon className='text-lg mr-2' icon={faImage} />
            Change image
          </div>
        </>
      )
    },
    {
      key: '1',
      label: <span className='text-base font-semibold'>Images</span>,
      children: listImages(images)
    },
    {
      key: '2',
      label: <span className='text-base font-semibold'>Files</span>,
      children: listFiles(images)
    },
    {
      key: '3',
      label: <span className='text-base font-semibold'>Links</span>,
      children: listLinks(images)
    },
    {
      key: '4',
      label: <span className='text-base font-semibold'>Audio</span>,
      children: listAudio(images)
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
        <div className='leave-group w-full flex flex-row items-center cursor-pointer px-3 py-2 rounded-full'>
          <FontAwesomeIcon className='text-lg mr-2' icon={faRightFromBracket} />
          Leave group
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
      theme={{ components: { Collapse: { headerPadding: '8px 12px', contentPadding: '0px 12px' } } }}>
      <StyleProvider theme={themeColorSet}>
        {openAvatar && <ChangeAvatarGroup image={currentConversation.image} />}
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
              borderLeft: '1px solid ' + themeColorSet.colorTextReverse2,
              backgroundColor: themeColorSet.colorBg1
            }}>
            <Col className='info h-full'>
              <Row align='middle' justify='center'>
                <Space size={10} direction='vertical' align='center'>
                  <div className='avatar mt-5'>
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
                <SearchOutlined
                  className='text-xl flex items-center justify-center px-2 py-2 rounded-full cursor-pointer'
                  style={{ backgroundColor: themeColorSet.colorBg4 }}
                />
              </Row>
              <Collapse
                items={listOptions}
                defaultActiveKey={['5']}
                ghost
                expandIconPosition='start'
                expandIcon={({ isActive }) => (
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    style={{
                      transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  />
                )}
              />
            </Col>
          </div>
        )}
      </StyleProvider>
    </ConfigProvider>
  );
};

export default ConversationOption;
