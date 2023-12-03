import { faUpRightFromSquare, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Dropdown, type MenuProps } from 'antd';
import { useMediaQuery } from 'react-responsive';

import UserInfoPost from '@/components/PostProperties/PostUserInfo';
import ContentPost from '@/components/PostProperties/PostContent';
import PostFooter from '@/components/PostProperties/PostFooter';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { IPost, IUserInfo } from '@/types';
import StyleProvider from './cssPost';
import { forwardRef, useEffect, useState } from 'react';

interface IPostProps {
  post: IPost;
  postAuthor: IUserInfo;
  currentUser: IUserInfo;
}

// -----------------------------------------------------

const OtherPost = forwardRef<HTMLDivElement, IPostProps>(({ post, postAuthor, currentUser }, ref) => {
  const link = post.post_attributes.url;

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
    }
  ];

  return (
    <StyleProvider ref={ref} theme={themeColorSet} className='rounded-lg mb-4'>
      <div className='post px-4 py-3'>
        <div className='postHeader flex justify-between items-center'>
          <div className='postHeader__left'>
            <UserInfoPost
              userInfo={post.post_attributes.user}
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
          <PostFooter post={post} postAuthor={postAuthor} currentUser={currentUser} />
        </div>
      </div>
    </StyleProvider>
  );
});

export default OtherPost;
