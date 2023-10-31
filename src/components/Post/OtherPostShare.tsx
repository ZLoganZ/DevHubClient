import { faUpRightFromSquare, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useMediaQuery } from 'react-responsive';

import UserInfoPost from '@/components/PostProperties/PostUserInfo';
import ContentPost from '@/components/PostProperties/PostContent';
import PostFooter from '@/components/PostProperties/PostFooter';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { PostType, UserInfoType } from '@/types';
import StyleProvider from './cssPost';
import { useEffect, useState } from 'react';
interface IPostShare {
  postShared: PostType;
  postAuthor: UserInfoType;
  postSharer: UserInfoType;
  currentUser: UserInfoType;
}

const PostShare: React.FC<IPostShare> = ({ postShared, postAuthor, postSharer, currentUser }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  // ----------------------- Post --------------------------
  const post = postShared.post_attributes.post;

  const link = post?.post_attributes.url;

  //format date to get full date
  const [isShowTime, setIsShowTime] = useState(getDateTimeToNow(postShared.createdAt));

  //format date to get full date
  const [postDate, setPostDate] = useState(getDateTimeToNow(post!.createdAt));

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setIsShowTime(getDateTimeToNow(postShared.createdAt));
      setPostDate(getDateTimeToNow(post!.createdAt));
    }, 60000);
    return () => clearInterval(timeoutId);
  }, []);

  useMediaQuery({ maxWidth: 639 });

  // postShared setting
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
    }
  ];

  return (
    <StyleProvider theme={themeColorSet} className='rounded-lg mb-4'>
      <div className='post px-4 py-3'>
        <div className='postHeader flex justify-between items-center'>
          <div className='postHeader__left'>
            <UserInfoPost userInfo={postAuthor} postID={postShared._id} date={isShowTime} />
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
              image={post!.post_attributes.images}
              link={link}
            />
          </div>
        </div>
        <div className='postFooter'>
          <PostFooter
            post={postShared}
            postAuthor={postAuthor}
            isPostShare={true}
            currentUser={currentUser}
          />
        </div>
      </div>
    </StyleProvider>
  );
};

export default PostShare;
