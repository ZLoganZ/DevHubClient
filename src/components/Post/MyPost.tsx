import { faUpRightFromSquare, faEllipsis, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Dropdown, type MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { openDrawer } from '@/redux/Slice/DrawerHOCSlice';
import EditPostForm from '@/components/Form/EditPostForm';
import UserInfoPost from '@/components/PostProperties/PostUserInfo';
import ContentPost from '@/components/PostProperties/PostContent';
import PostFooter from '@/components/PostProperties/PostFooter';
import DeleteModal from '@/components/PostProperties/DeletePostModal';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { IPost, IUserInfo } from '@/types';
import StyleProvider from './cssPost';

interface IPostProps {
  post: IPost;
  postAuthor: IUserInfo;
}

// -----------------------------------------------------

const MyPost: React.FC<IPostProps> = ({ post, postAuthor }) => {
  const link = post.post_attributes.url;
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  //format date to get full date
  const [isShowTime, setIsShowTime] = useState(getDateTimeToNow(post.createdAt));

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setIsShowTime(getDateTimeToNow(post.createdAt));
    }, 60000);
    return () => clearInterval(timeoutId);
  }, []);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useMediaQuery({ maxWidth: 639 });

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
                key={post._id}
                id={post._id}
                title={post.post_attributes.title!}
                content={post.post_attributes.content!}
                image={post.post_attributes.images}
                visibility={post.visibility}
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

  return (
    <StyleProvider theme={themeColorSet} className='rounded-lg mb-4'>
      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        postID={post._id}
        image={post.post_attributes.images}
      />
      <div className='post px-4 py-3'>
        <div className='postHeader flex justify-between items-center'>
          <div className='postHeader__left'>
            <UserInfoPost
              userInfo={postAuthor}
              postID={post._id}
              date={isShowTime}
              visibility={post.visibility}
            />
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
            image={post.post_attributes.images}
            link={link}
          />
          <Divider style={{ backgroundColor: themeColorSet.colorText1, marginTop: 0 }} />
        </div>
        <div className='postFooter'>
          <PostFooter post={post} postAuthor={postAuthor} currentUser={postAuthor} />
        </div>
      </div>
    </StyleProvider>
  );
};

export default MyPost;
