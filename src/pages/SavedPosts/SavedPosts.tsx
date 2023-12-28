import { useRef } from 'react';
import { Empty, Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/special';
import { getTheme } from '@/util/theme';
import { useCurrentUserInfo, useSavedPostsData } from '@/hooks/fetch';
import StyleProvider from './cssSavedPosts';
import OtherPost from '@/components/Post/OtherPost';

const SavedPosts = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { currentUserInfo } = useCurrentUserInfo();

  const {
    savedPosts,
    isLoadingSavedPosts,
    hasNextSavedPosts,
    isFetchingNextSavedPosts,
    fetchNextSavedPosts
  } = useSavedPostsData();

  return (
    <StyleProvider theme={themeColorSet}>
      {isLoadingSavedPosts ? (
        <div className='flex flex-col flex-1 items-center justify-center p-5'>
          <div className='flex justify-center mb-2'>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24, color: themeColorSet.colorText1 }} spin />}
            />
          </div>
        </div>
      ) : savedPosts.length === 0 ? (
        <div className='flex flex-col flex-1 items-center justify-center p-5'>
          <Empty
            className='cursor-default px-40'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='No posts saved yet'
          />
        </div>
      ) : (
        <div className='flex flex-col flex-1 items-center justify-center p-5'>
          {savedPosts.map((post) => (
            <div key={post._id} className='w-[50%]'>
              <OtherPost post={post} postAuthor={post.post_attributes.user} currentUser={currentUserInfo} />
            </div>
          ))}

          <div className='savedPosts__bottom' ref={bottomRef}>
            {hasNextSavedPosts && (
              <button
                className='savedPosts__bottom__btn'
                onClick={() => fetchNextSavedPosts()}
                disabled={isFetchingNextSavedPosts}>
                {isFetchingNextSavedPosts ? 'Đang tải...' : 'Xem thêm'}
              </button>
            )}
          </div>
        </div>
      )}
    </StyleProvider>
  );
};

export default SavedPosts;
