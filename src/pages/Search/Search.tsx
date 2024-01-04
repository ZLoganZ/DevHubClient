import { useRef } from 'react';
import { Avatar, Col, Empty, List, Popover, Row, Spin } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/hooks/special';
import { getTheme } from '@/util/theme';
import LoadingNewFeed from '@/components/Loading/LoadingNewFeed';
import { LoadingOutlined } from '@ant-design/icons';
import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import { useCurrentUserInfo, useGetPostsByTitle, useGetUsersByName } from '@/hooks/fetch';

import StyleProvider from './cssSearch';
import { ButtonFriend } from '@/components/MiniComponent';
import getImageURL from '@/util/getImageURL';
import PopupInfoUser from '@/components/PopupInfoUser';

const Search = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const navigate = useNavigate();

  const { currentUserInfo } = useCurrentUserInfo();

  const searchValue = new URLSearchParams(window.location.search).get('search') || '';

  const bottomRef = useRef<HTMLDivElement>(null);

  const { postsByTitle, isLoadingPostsByTitle, isFetchingPostsByTitle } = useGetPostsByTitle(searchValue);
  const { usersByName, isLoadingUsersByName } = useGetUsersByName(searchValue);

  const handleShowUserProfile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation();
    navigate(`/user/${id}`);
  };

  const isMdScreen = useMediaQuery({ maxWidth: 1023 });

  return (
    <StyleProvider theme={themeColorSet}>
      {isLoadingPostsByTitle || isLoadingUsersByName ? (
        <LoadingNewFeed />
      ) : (
        <Row>
          <Col className='md:ml-0' offset={isMdScreen ? 0 : 3} span={isMdScreen ? 24 : 18}>
            <div className='news-feed flex justify-between mt-10'>
              <div className='news-feed-left w-8/12 md:w-full'>
                <div className='users rounded-lg mb-4'>
                  <div className='people p-2 text-2xl font-bold'>People</div>
                  <List
                    itemLayout='horizontal'
                    className='listSearch border-none'
                    bordered={true}
                    dataSource={usersByName}
                    renderItem={(user) => (
                      <List.Item>
                        <div className='w-full rounded-md'>
                          <List.Item.Meta
                            avatar={
                              <div
                                onClick={(e) => {
                                  handleShowUserProfile(e, user._id);
                                }}>
                                <Avatar
                                  className='cursor-pointer w-11 h-11'
                                  src={getImageURL(user.user_image, 'avatar_mini')}
                                />
                              </div>
                            }
                            title={
                              <div className='cursor-pointer font-bold hover:underline'>
                                <Popover
                                  overlayInnerStyle={{
                                    border: `1px solid ${themeColorSet.colorBg3}`
                                  }}
                                  mouseEnterDelay={0.4}
                                  content={<PopupInfoUser userInfo={user} userID={currentUserInfo._id} />}>
                                  <div className='name__top font-bold'>
                                    <NavLink
                                      to={`/user/${user._id}`}
                                      style={{ color: themeColorSet.colorText1 }}>
                                      {user.name}
                                    </NavLink>
                                  </div>
                                </Popover>
                              </div>
                            }
                            description={user.alias ? `@${user.alias}` : '@user'}
                          />
                        </div>
                        <div className='friendButton'>
                          <ButtonFriend user={user} />
                        </div>
                      </List.Item>
                    )}
                  />
                </div>

                <div className='show'>
                  {postsByTitle.length === 0 && (
                    <Empty
                      className='cursor-default px-40'
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description='No posts found'
                    />
                  )}
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
