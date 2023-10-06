import {
  faUpRightFromSquare,
  faEllipsis,
  faTrash,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Modal, notification } from 'antd';
import type { MenuProps } from 'antd';
import { useMediaQuery } from 'react-responsive';

import UserInfoPost from '@/components/PostProperties/PostUserInfo';
import ContentPost from '@/components/PostProperties/PostContent';
import PostFooter from '@/components/PostProperties/PostFooter';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import formatDateTime from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { useDeletePost } from '@/hooks/mutation';
import { PostType, UserInfoType } from '@/types';
import StyleProvider from './cssPost';
interface PostShareProps {
  postShared: PostType;
  postAuthor: UserInfoType;
  postSharer: UserInfoType;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const MyPostShare = ({ postShared, postAuthor, postSharer }: PostShareProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateDeletePost } = useDeletePost();

  // ----------------------- Post --------------------------
  const post = postShared.post_attributes.post;

  const link = post?.post_attributes.url;

  //format date to get full date
  const date = formatDateTime(postShared.createdAt);

  //format date to get full date
  const postDate = formatDateTime(post!.createdAt);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    mutateDeletePost(postShared._id);

    setIsModalOpen(false);
    openNotificationWithIcon('success');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // post setting
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className='item flex items-center px-4 py-2'>
          <FontAwesomeIcon className='icon' icon={faUpRightFromSquare} />
          <span className='ml-2'>Open post in new tab</span>
        </div>
      ),
      onClick: () => {
        window.open(`/post/${postShared._id}`, '_blank')?.focus();
      }
    },
    {
      key: '2',
      label: (
        <div key='2' className='item flex items-center px-4 py-2'>
          <FontAwesomeIcon className='icon' icon={faTrash} />
          <span className='ml-2'>Delete post</span>
        </div>
      ),
      onClick: () => {
        showModal();
      }
    }
  ];

  // Notification delete post
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Delete Successfully',
      placement: 'bottomRight'
    });
  };

  return (
    <StyleProvider theme={themeColorSet} className='rounded-lg mb-4'>
      {contextHolder}
      <Modal
        title={
          <>
            <FontAwesomeIcon
              className='icon mr-2'
              icon={faTriangleExclamation}
              style={{ color: commonColor.colorWarning1 }}
            />
            <span>Are you sure delete this post?</span>
          </>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            backgroundColor: commonColor.colorBlue1
          }
        }}
        cancelButtonProps={{
          style: {
            color: themeColorSet.colorText1,
            backgroundColor: themeColorSet.colorBg3
          }
        }}>
        <p>You will not be able to recover files after deletion!</p>
      </Modal>
      <div className='post px-4 py-3'>
        <div className='postHeader flex justify-between items-center'>
          <div className='postHeader__left'>
            <UserInfoPost userInfo={postAuthor} postID={postShared._id} date={date} />
          </div>
          <div className='postHeader__right'>
            <div className='icon'>
              <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
                <FontAwesomeIcon size='lg' icon={faEllipsis} />
              </Dropdown>
            </div>
          </div>
        </div>
        <div className='space-align-block'>
          <div className='postHeader flex justify-between items-center'>
            <div className='postHeader__left'>
              <UserInfoPost userInfo={postSharer} postID={post!._id} date={postDate} />
            </div>
          </div>
          <div className='postBody mt-5'>
            <ContentPost
              postID={postShared._id}
              title={post!.post_attributes.title!}
              content={post!.post_attributes.content!}
              img={post!.post_attributes.img}
              link={link}
            />
          </div>
        </div>
        <div className='postFooter'>
          <PostFooter post={postShared} postAuthor={postAuthor} isPostShare={true} currentUser={postSharer} />
        </div>
      </div>
    </StyleProvider>
  );
};

export default MyPostShare;
