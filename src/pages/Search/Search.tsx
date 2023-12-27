import { useRef } from 'react';
import { Col, Row, Spin } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useAppSelector } from '@/hooks/special';
import { getTheme } from '@/util/theme';
import LoadingNewFeed from '@/components/Loading/LoadingNewFeed';
import { LoadingOutlined } from '@ant-design/icons';
import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import { useCurrentUserInfo, useGetPostsByTitle } from '@/hooks/fetch';

import StyleProvider from './cssSearch';
const Search = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();

  const searchValue = new URLSearchParams(window.location.search).get('search') || '';

  console.log(searchValue);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { postsByTitle, isLoadingPostsByTitle, isFetchingPostsByTitle } = useGetPostsByTitle(searchValue);

  const isMdScreen = useMediaQuery({ maxWidth: 1023 });

  return (
    <StyleProvider theme={themeColorSet}>
      {isLoadingPostsByTitle ? (
        <LoadingNewFeed />
      ) : (
        <Row>
          <Col className='md:ml-0' offset={isMdScreen ? 0 : 3} span={isMdScreen ? 24 : 18}>
            <div className='news-feed flex justify-between mt-10'>
              <div className='news-feed-left w-8/12 md:w-full'>
                <div className='show'>
                  {postsByTitle.map((item, index) => {
                    return (
                      <div key={item._id}>
                        {index === postsByTitle.length - 3 && (
                          <div className='absolute max-h-[130rem] w-full -z-10' ref={bottomRef} />
                        )}
                        {item.type === 'Post' ? (
                          <OtherPost
                            post={item}
                            postAuthor={item.post_attributes.user}
                            currentUser={currentUserInfo}
                          />
                        ) : (
                          <OtherPostShare
                            postShared={item}
                            postAuthor={item.post_attributes.user}
                            postSharer={item.post_attributes.owner_post!}
                            currentUser={currentUserInfo}
                          />
                        )}
                      </div>
                    );
                  })}
                  {isFetchingPostsByTitle && (
                    <div className='flex justify-center mb-2'>
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24, color: themeColorSet.colorText1 }} spin />
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className='news-feed-right w-4/12 pl-3 md:hidden'></div>
            </div>
          </Col>
        </Row>
      )}
    </StyleProvider>
  );
};

export default Search;
