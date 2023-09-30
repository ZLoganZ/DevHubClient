import { faUpRightFromSquare, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';

import OpenOtherPostDetailModal from '@/components/ActionComponent/OpenDetail/OpenOtherPostDetailModal';
import UserInfoPost from '@/components/PostProperties/PostUserInfo';
import ContentPost from '@/components/PostProperties/PostContent';
import PostFooter from '@/components/PostProperties/PostFooter';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { PostType, UserInfoType } from '@/types';
import formatDateTime from '@/util/formatDateTime';
import StyleProvider from './cssPost';
import { useMediaQuery } from 'react-responsive';

interface PostProps {
  post: PostType;
  userInfo: UserInfoType;
}

// -----------------------------------------------------

const OtherPost = ({ post, userInfo }: PostProps) => {
  const link = post.post_attributes.url;

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  //format date to get full date
  const date = formatDateTime(post.createdAt);

  // post setting
  const items: MenuProps["items"] = [
    {
      key: "1",
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

  // Open OtherPostDetailModal
  const [isOpenPostDetail, setIsOpenPostDetail] = useState(false);

  /*   function removeCode(htmlString: any): any {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    const elements = doc.getElementsByClassName('ql-syntax');
    while (elements.length > 0) elements[0].remove();
    return doc.body.innerHTML;
  } */
  const isXsScreen = useMediaQuery({ maxWidth: 639 });
  return (
    <StyleProvider theme={themeColorSet} className='rounded-lg mb-4'>
      {isOpenPostDetail && (
        <OpenOtherPostDetailModal
          key={post._id + 'Modal'}
          post={post}
          userInfo={userInfo}
          visible={isOpenPostDetail}
          setVisible={setIsOpenPostDetail}
        />
      )}
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
        <div className='postFooter '>
          <PostFooter post={post} setIsOpenPostDetail={setIsOpenPostDetail} />
        </div>
      </div>
    </StyleProvider>
  );
};

export default OtherPost;
