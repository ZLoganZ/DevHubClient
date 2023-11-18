import { useCallback, useEffect, useMemo, useState } from 'react';
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
  faTrash,
  faUser,
  faUserShield,
  faUserSlash,
  faUsersSlash
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import {
  faEye,
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
  type MenuProps,
  Dropdown,
  Collapse,
  ConfigProvider,
  Tooltip
} from 'antd';
import { SearchOutlined, CrownFilled } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';

import { useCurrentConversationData, useCurrentUserInfo, useMessagesImage } from '@/hooks/fetch';
import { useDissolveGroup, useLeaveGroup, useReceiveConversation, useSendMessage } from '@/hooks/mutation';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { Socket } from '@/util/constants/SettingSystem';
import getImageURL from '@/util/getImageURL';
import { useAppSelector, useOtherUser } from '@/hooks/special';
import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import AvatarMessage from '@/components/ChatComponents/Avatar/AvatarMessage';
import ChangeAvatarGroup from '@/components/ChatComponents/OpenModal/ChangeAvatarGroup';
import ChangeGroupName from '@/components/ChatComponents/OpenModal/ChangeGroupName';
import AddMemberToGroup from '@/components/ChatComponents/OpenModal/AddMemberToGroup';
import { messageService } from '@/services/MessageService';
import { IMessage, IUserInfo } from '@/types';
import StyleProvider from './cssConversationOption';

interface IConversationOption {
  conversationID: string;
}

const ConversationOption: React.FC<IConversationOption> = ({ conversationID }) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { visible } = useAppSelector((state) => state.modalHOC);
  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const navigate = useNavigate();

  const { currentUserInfo } = useCurrentUserInfo();
  const { messagesImage, isLoadingMessagesImage } = useMessagesImage(conversationID);
  const { mutateReceiveConversation } = useReceiveConversation();
  const { isLoadingCurrentConversation, currentConversation } = useCurrentConversationData(conversationID);
  const { mutateLeaveGroup } = useLeaveGroup();
  const { mutateDissolveGroup } = useDissolveGroup();
  const { mutateSendMessage } = useSendMessage();

  const otherUser = useOtherUser(currentConversation);
  const followers = useMemo(() => {
    return currentUserInfo.members;
  }, [currentUserInfo.members]);

  // filter members in followers but not in conversation
  const members = useMemo(() => {
    return followers.filter((follower) => {
      return !currentConversation.members.some((member) => member._id === follower._id);
    });
  }, [followers, currentConversation.members]);

  const [openAvatar, setOpenAvatar] = useState(false);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);

  const [audios, setAudios] = useState<IMessage[]>([]);
  const [files, setFiles] = useState<IMessage[]>([]);
  const [links, setLinks] = useState<IMessage[]>([]);

  useEffect(() => {
    setLinks([]);
    setFiles([]);
    setAudios([]);
  }, []);

  useEffect(() => {
    if (!visible && openAvatar) {
      setOpenAvatar(false);
    }
    if (!visible && openChangeName) {
      setOpenChangeName(false);
    }
    if (!visible && openAddMember) {
      setOpenAddMember(false);
    }
  }, [visible]);

  const memberOptions = useCallback(
    (user: IUserInfo): MenuProps['items'] => {
      const isCurrentUser = user._id === currentUserInfo._id;
      const isAdmin = currentConversation.admins.some((admin) => admin._id === user._id);
      const isCurrentUserAdmin = currentConversation.admins.some(
        (admin) => admin._id === currentUserInfo._id
      );
      const isCurrentUserCreator = currentConversation.creator === currentUserInfo._id;
      return [
        {
          key: '1',
          label: 'Commission as administrator',
          icon: <FontAwesomeIcon icon={faUserShield} />,
          style: {
            display: !isAdmin && isCurrentUserAdmin ? '' : 'none'
          },
          onClick: () => {
            void messageService.commissionAdmin(currentConversation._id, user._id).then((res) => {
              chatSocket.emit(Socket.COMMISSION_ADMIN, res.data.metadata);

              const message = {
                _id: uuidv4().replace(/-/g, ''),
                conversation_id: conversationID,
                sender: {
                  _id: currentUserInfo._id,
                  user_image: currentUserInfo.user_image,
                  name: currentUserInfo.name
                },
                isSending: true,
                type: 'notification',
                content: `promoted ${user.name} to administrator`,
                createdAt: new Date()
              };

              mutateSendMessage(message as unknown as IMessage);
              chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
            });
          }
        },
        {
          key: '2',
          label: 'Revoke administrator',
          icon: <FontAwesomeIcon icon={faUserSlash} />,
          style: {
            display: isCurrentUserCreator && isAdmin && !isCurrentUser ? '' : 'none'
          },
          onClick: () => {
            void messageService.removeAdmin(currentConversation._id, user._id).then((res) => {
              chatSocket.emit(Socket.DECOMMISSION_ADMIN, res.data.metadata);

              const message = {
                _id: uuidv4().replace(/-/g, ''),
                conversation_id: conversationID,
                sender: {
                  _id: currentUserInfo._id,
                  user_image: currentUserInfo.user_image,
                  name: currentUserInfo.name
                },
                isSending: true,
                type: 'notification',
                content: `revoked ${user.name} as administrator`,
                createdAt: new Date()
              };

              mutateSendMessage(message as unknown as IMessage);
              chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
            });
          }
        },
        {
          key: '3',
          label: 'Message',
          icon: <FontAwesomeIcon icon={faCommentDots} />,
          style: {
            display: user._id === currentUserInfo._id ? 'none' : ''
          },
          onClick: () => {
            void messageService
              .createConversation({
                type: 'private',
                members: [user._id]
              })
              .then((res) => {
                chatSocket.emit(Socket.NEW_CONVERSATION, res.data.metadata);
                mutateReceiveConversation(res.data.metadata);
                navigate(`/message/${res.data.metadata._id}`);
              });
          }
        },
        {
          label: 'View profile',
          key: '4',
          icon: <FontAwesomeIcon icon={faUser} />,
          onClick: () => {
            navigate(`/user/${user._id}`);
          }
        },
        {
          type: 'divider',
          style: {
            display:
              (isAdmin && !isCurrentUser && !isCurrentUserCreator) || (!isCurrentUserAdmin && !isCurrentUser)
                ? 'none'
                : ''
          }
        },
        {
          key: '5',
          label: isCurrentUser ? 'Leave group' : isCurrentUserAdmin && 'Remove member',
          danger: true,
          icon: isCurrentUser ? (
            <FontAwesomeIcon className='text-xl' icon={faRightFromBracket} />
          ) : (
            isCurrentUserAdmin && <FontAwesomeIcon icon={faUserSlash} />
          ),
          style: {
            display:
              (isAdmin && !isCurrentUser && !isCurrentUserCreator) || (!isCurrentUserAdmin && !isCurrentUser)
                ? 'none'
                : ''
          },
          onClick: () => {
            if (user._id === currentUserInfo._id) {
              mutateLeaveGroup(conversationID);
              const message = {
                _id: uuidv4().replace(/-/g, ''),
                conversation_id: conversationID,
                sender: {
                  _id: currentUserInfo._id,
                  user_image: currentUserInfo.user_image,
                  name: currentUserInfo.name
                },
                isSending: true,
                type: 'notification',
                content: 'left the group',
                createdAt: new Date()
              };

              mutateSendMessage(message as unknown as IMessage);
              chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
            } else {
              void messageService.removeMember(currentConversation._id, user._id).then((res) => {
                chatSocket.emit(Socket.REMOVE_MEMBER, { ...res.data.metadata, remove_userID: user._id });

                const message = {
                  _id: uuidv4().replace(/-/g, ''),
                  conversation_id: conversationID,
                  sender: {
                    _id: currentUserInfo._id,
                    user_image: currentUserInfo.user_image,
                    name: currentUserInfo.name
                  },
                  isSending: true,
                  type: 'notification',
                  content: `removed ${user.name}`,
                  createdAt: new Date()
                };

                mutateSendMessage(message as unknown as IMessage);
                chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
              });
            }
          }
        }
      ];
    },
    [currentConversation.admins, currentUserInfo]
  );

  const downloadImage = async (url?: string) => {
    if (!url) return;
    const originalImage = url;
    const image = await fetch(getImageURL(originalImage)!);

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

  const listItems = useCallback(
    (items: IMessage[], icon: IconDefinition, description: string, isLoading: boolean) => {
      return (
        <div className='content'>
          {isLoading ? (
            <>Loading...</>
          ) : items.length === 0 ? (
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
              {items.map((item) =>
                item.images?.map((image, index) => (
                  <div
                    className='fileContent flex justify-between items-center mb-2 ml-2'
                    key={item._id + index}>
                    <div className='left flex justify-between items-center'>
                      <div className='image mr-2 flex rounded-xl h-14 w-14 overflow-hidden'>
                        <Image
                          src={getImageURL(image, 'post')}
                          alt='image'
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          preview={{ src: getImageURL(image), mask: <FontAwesomeIcon icon={faEye} /> }}
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
                        void downloadImage(image);
                      }}>
                      <FontAwesomeIcon icon={faDownload} />
                    </div>
                  </div>
                ))
              )}
              {items.length > 4 && (
                <div
                  className='seeAll flex items-end justify-end'
                  style={{
                    color: themeColorSet.colorText2,
                    fontSize: '0.8rem',
                    textDecoration: 'underline'
                  }}>
                  <p className='cursor-pointer'>See all</p>
                </div>
              )}
            </>
          )}
        </div>
      );
    },
    [themeColorSet]
  );

  const listImages = (items: IMessage[]) => {
    return listItems(items, faReImages, 'No images', isLoadingMessagesImage);
  };

  const listFiles = (items: any) => {
    return listItems(items, faReFolderOpen, 'No files', false);
  };

  const listLinks = (items: any) => {
    return listItems(items, faLink, 'No links', false);
  };

  const listAudio = (items: any) => {
    return listItems(items, faReFileAudio, 'No audio', false);
  };

  const listMembers = useCallback(() => {
    return (
      <div className='pr-5 w-full'>
        <div className='listUser flex flex-col w-full pl-3' style={{ overflow: 'auto' }}>
          {currentConversation.members.map((member) => {
            const isAdmin = currentConversation.admins.some((admin) => admin._id === member._id);
            const isCreator = currentConversation.creator === member._id;
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
                    <div
                      className='avatar-member relative cursor-pointer'
                      onClick={() => {
                        void messageService
                          .createConversation({
                            type: 'private',
                            members: [member._id]
                          })
                          .then((res) => {
                            chatSocket.emit(Socket.NEW_CONVERSATION, res.data.metadata);
                            mutateReceiveConversation(res.data.metadata);
                            navigate(`/message/${res.data.metadata._id}`);
                          });
                      }}>
                      <AvatarMessage key={member._id} user={member} />
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
                      {isAdmin &&
                        (isCreator ? (
                          <CrownFilled className='ml-1 text-base' />
                        ) : (
                          <FontAwesomeIcon className='ml-1' icon={faShieldHalved} />
                        ))}
                    </div>
                    {isAdmin &&
                      (isCreator ? (
                        <p className='text-xs'>Group creator</p>
                      ) : (
                        <p className='text-xs'>Administrator</p>
                      ))}
                  </div>
                </div>

                <Dropdown
                  className='options h-5 w-5 p-1 rounded-full cursor-pointer'
                  menu={{ items: memberOptions(member) }}
                  trigger={['click']}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </Dropdown>
              </div>
            );
          })}
        </div>
        <div
          className='add-member mt-3 w-full flex items-center flex-row cursor-pointer pl-3 pr-5 py-2 rounded-full'
          onClick={() => setOpenAddMember(!openAddMember)}>
          <FontAwesomeIcon className='text-2xl' icon={faPlusCircle} />
          <span className='text-sm font-medium text-left ml-2'>Add members</span>
        </div>
      </div>
    );
  }, [themeColorSet, currentConversation.admins, currentConversation.members, memberOptions]);

  const listOptions: CollapseProps['items'] = [
    {
      key: 0,
      label: <span className='text-base font-semibold'>Conversation setting</span>,
      children: (
        <>
          <div
            className='rename w-full flex flex-row items-center cursor-pointer px-3 py-2 rounded-full'
            onClick={() => setOpenChangeName(!openChangeName)}>
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
      children: listImages(messagesImage ?? [])
    },
    {
      key: '2',
      label: <span className='text-base font-semibold'>Files</span>,
      children: listFiles(files)
    },
    {
      key: '3',
      label: <span className='text-base font-semibold'>Links</span>,
      children: listLinks(links)
    },
    {
      key: '4',
      label: <span className='text-base font-semibold'>Audio</span>,
      children: listAudio(audios)
    },
    {
      key: '5',
      label: <span className='text-base font-semibold'>Members</span>,
      children: listMembers()
    },
    {
      key: '6',
      label: <span className='text-base font-semibold'>Private & Supports</span>,
      children:
        currentConversation.type === 'group' ? (
          <div className='flex flex-col gap-1'>
            {currentConversation.creator === currentUserInfo._id && (
              <div
                className='leave-group w-full flex flex-row items-center cursor-pointer gap-2 px-3 py-2 rounded-full'
                onClick={() => {
                  mutateDissolveGroup(conversationID);
                }}>
                <FontAwesomeIcon icon={faUsersSlash} />
                Dissolve group
              </div>
            )}
            <div
              className='leave-group w-full flex flex-row items-center cursor-pointer gap-2 px-3 py-2 rounded-full'
              onClick={() => {
                mutateLeaveGroup(conversationID);
                const message = {
                  _id: uuidv4().replace(/-/g, ''),
                  conversation_id: conversationID,
                  sender: {
                    _id: currentUserInfo._id,
                    user_image: currentUserInfo.user_image,
                    name: currentUserInfo.name
                  },
                  isSending: true,
                  type: 'notification',
                  content: 'left the group',
                  createdAt: new Date()
                };

                mutateSendMessage(message as unknown as IMessage);
                chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
              }}>
              <FontAwesomeIcon className='text-lg' icon={faRightFromBracket} />
              Leave group
            </div>
            <div className='leave-group w-full flex flex-row items-center cursor-pointer gap-2 px-3 py-2 rounded-full'>
              <FontAwesomeIcon className='text-lg mr-[2px]' icon={faTrash} />
              Delete conversation
            </div>
          </div>
        ) : (
          <div className='leave-group w-full flex flex-row items-center cursor-pointer gap-2 px-3 py-2 rounded-full'>
            <FontAwesomeIcon className='text-lg mr-[2px]' icon={faTrash} />
            Delete conversation
          </div>
        )
    }
  ];

  if (currentConversation.type !== 'group') {
    listOptions.splice(5, 1);
    listOptions.splice(0, 1);
  }

  return (
    <ConfigProvider
      theme={{ components: { Collapse: { headerPadding: '8px 12px', contentPadding: '0px 12px' } } }}>
      <StyleProvider theme={themeColorSet}>
        {openAvatar && (
          <ChangeAvatarGroup image={currentConversation.image} conversationID={conversationID} />
        )}
        {openChangeName && (
          <ChangeGroupName name={currentConversation.name} conversationID={conversationID} />
        )}
        {openAddMember && <AddMemberToGroup conversationID={conversationID} users={members} />}
        {isLoadingCurrentConversation ? (
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
                        preview
                        size={120}
                      />
                    ) : (
                      <AvatarMessage key={otherUser._id} user={otherUser} size={120} preview />
                    )}
                  </div>
                  <span className='name font-semibold text-xl'>
                    {currentConversation.name ?? (
                      <NavLink to={`/user/${otherUser._id}`}>{otherUser.name}</NavLink>
                    )}
                  </span>
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
