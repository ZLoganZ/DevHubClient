import {
  faUpRightFromSquare,
  faEllipsis,
  faPenToSquare,
  faTrash,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Dropdown, Modal, notification } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { sha1 } from 'crypto-hash';

import { openDrawer } from '@/redux/Slice/DrawerHOCSlice';
import EditPostForm from '@/components/Form/EditPostForm';
import UserInfoPost from '@/components/PostProperties/PostUserInfo';
import ContentPost from '@/components/PostProperties/PostContent';
import PostFooter from '@/components/PostProperties/PostFooter';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import formatDateTime from '@/util/formatDateTime';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useDeletePost } from '@/hooks/mutation';
import { PostType, UserInfoType } from '@/types';
import StyleProvider from './cssPost';

interface PostProps {
  post: PostType;
  userInfo: UserInfoType;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

// -----------------------------------------------------

const MyPost = ({ post, userInfo }: PostProps) => {
  const link = post.post_attributes.url;
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateDeletePost } = useDeletePost();

  //format date to get full date
  const date = formatDateTime(post.createdAt);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

  const handleRemoveImage = async (imageURL: any) => {
    const nameSplit = imageURL.split('/');
    const duplicateName = nameSplit.pop();

    // Remove .
    const public_id = duplicateName?.split('.').slice(0, -1).join('.');

    const formData = new FormData();
    formData.append('api_key', '235531261932754');
    formData.append('public_id', public_id);
    const timestamp = String(Date.now());
    formData.append('timestamp', timestamp);
    const signature = await sha1(`public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`);
    formData.append('signature', signature);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return {
      url: data,
      status: 'done'
    };
  };

  const handleOk = async () => {
    if (post.post_attributes.img) await handleRemoveImage(post.post_attributes.img);

    mutateDeletePost(post._id);

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
        window.open(`/post/${post._id}`, '_blank')?.focus();
      }
    },
    {
      key: '2',
      label: (
        <div className='item flex items-center px-4 py-2'>
          <FontAwesomeIcon className='icon' icon={faPenToSquare} />
          <span className='ml-2'>Edit post</span>
        </div>
      ),
      onClick: () => {
        dispatch(
          openDrawer({
            title: 'Edit post',
            component: (
              <EditPostForm
                key={Math.random()}
                id={post._id}
                title={post.post_attributes.title!}
                content={post.post_attributes.content!}
                img={post.post_attributes.img}
              />
            )
          })
        );
      }
    },
    {
      key: '3',
      label: (
        <div key='3' className='item flex items-center px-4 py-2'>
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

  /*   function removeCode(htmlString: any): any {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    const elements = doc.getElementsByClassName('ql-syntax');
    while (elements.length > 0) elements[0].remove();
    return doc.body.innerHTML;
  } */

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
            color: themeColorSet.colorText1,
            backgroundColor: commonColor.colorBlue1
          }
        }}
        cancelButtonProps={{
          style: {
            color: themeColorSet.colorText1,
            backgroundColor: themeColorSet.colorBg3
          }
        }}>
        <p>You will not be able to recover the post after deleted!</p>
      </Modal>
      <div className='post px-4 py-3'>
        <div className='postHeader flex justify-between items-center'>
          <div className='postHeader__left'>
            <UserInfoPost userInfo={userInfo} postID={post._id} date={date} />
          </div>
          <div className='postHeader__right'>
            <div className='icon'>
              <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
                <FontAwesomeIcon size='lg' icon={faEllipsis} />
              </Dropdown>
            </div>
          </div>
        </div>
        <div className='postBody mt-5'>
          <ContentPost
            postID={post._id}
            title={post.post_attributes.title!}
            content={post.post_attributes.content!}
            img={post.post_attributes.img}
            link={link}
          />
          <Divider style={{ backgroundColor: themeColorSet.colorText1 }} />
        </div>
        <div className='postFooter'>
          <PostFooter post={post} userInfo={userInfo} />
        </div>
      </div>
    </StyleProvider>
  );
};

export default MyPost;
