import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Col, Dropdown, type MenuProps, Row, Skeleton, Space, Affix, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines /* , faUserFriends */ } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';

import OtherPostShare from '@/components/Post/OtherPostShare';
import NewPost from '@/components/NewPost';
import OtherPost from '@/components/Post/OtherPost';
import LoadingNewFeed from '@/components/Loading/LoadingNewFeed';

import { getTheme } from '@/util/theme';
import ConvertNumber from '@/util/convertNumber';
import getImageURL from '@/util/getImageURL';
import { useAllPopularPostsData, useAllNewsfeedPostsData, useCurrentUserInfo } from '@/hooks/fetch';
import { useAppSelector, useIntersectionObserver } from '@/hooks/special';

import StyleProvider from './cssNewsFeed';

const popular_time = [
  {
    label: 'Today',
    key: '1'
  },
  {
    label: 'This week',
    key: '2'
  },
  {
    label: 'This month',
    key: '3'
  },
  {
    label: 'This year',
    key: '4'
  },
  {
    label: 'All time',
    key: '5'
  }
];

const community = [
  {
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGiauApOpu95sj6IxatDeXrrAfCVznCpX41g&usqp=CAU',
    name: 'Water Cooler chats',
    description: 'Hang out and chat with your fellow developers in this general community',
    member: 3760
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png',
    name: 'Water Cooler chats',
    description: 'Hang out and chat with your fellow developers in this general community',
    member: 1376
  },
  {
    image:
      'https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
    name: 'Water Cooler chats',
    description: 'Hang out and chat with your fellow developers in this general community',
    member: 13154
  },
  {
    image:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
    name: 'Water Cooler chats',
    description: 'Hang out and chat with your fellow developers in this general community',
    member: 3757
  },
  {
    image:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
    name: 'Water Cooler chats',
    description: 'Hang out and chat with your fellow developers in this general community',
    member: 7573
  },
  {
    image:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
    name: 'Water Cooler chats',
    description: 'Hang out and chat with your fellow developers in this general community',
    member: 9343
  }
];

const NewsFeed = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const [popularOpen, setPopularOpen] = useState(false);
  const [popularvalue, setPopularvalue] = useState('All time');

  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    isLoadingAllNewsfeedPosts,
    allNewsfeedPosts,
    fetchNextNewsfeedPosts,
    hasNextNewsfeedPosts,
    isFetchingNextNewsfeedPosts
  } = useAllNewsfeedPostsData();

  const { allPopularPosts, isLoadingAllPopularPosts, isFetchingAllPopularPosts } =
    useAllPopularPostsData(popularvalue);

  const { currentUserInfo } = useCurrentUserInfo();

  const fetchNextNewsfeedPostsCallback = useCallback(() => {
    if (hasNextNewsfeedPosts && !isFetchingNextNewsfeedPosts) {
      fetchNextNewsfeedPosts();
    }
  }, [hasNextNewsfeedPosts, isFetchingNextNewsfeedPosts]);

  useIntersectionObserver(bottomRef, fetchNextNewsfeedPostsCallback, { threshold: 0 });

  useEffect(() => {
    if (isLoadingAllNewsfeedPosts) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    if (!isLoadingAllNewsfeedPosts && !isFetchingNextNewsfeedPosts) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isLoadingAllNewsfeedPosts]);

  const popular = useMemo(() => {
    return [...(allPopularPosts ?? [])];
  }, [allPopularPosts]);

  const handlePopularClick: MenuProps['onClick'] = (e) => {
    const a = popular_time.find((item) => item.key === e.key);
    setPopularvalue(a?.label ?? popularvalue);
    setPopularOpen(false);
  };

  const handleOpenPopularChange = (flag: boolean) => {
    setPopularOpen(flag);
  };

  const isMdScreen = useMediaQuery({ maxWidth: 1023 });

  const isNoPopularPosts = !isFetchingAllPopularPosts && !isLoadingAllPopularPosts && popular.length === 0;

  return (
    <StyleProvider theme={themeColorSet}>
      {!community || isLoadingAllNewsfeedPosts ? (
        <LoadingNewFeed />
      ) : (
        <Row>
          <Col className='md:ml-0' offset={isMdScreen ? 0 : 3} span={isMdScreen ? 24 : 18}>
            <div className='news-feed flex justify-between mt-10'>
              <div className='news-feed-left w-8/12 md:w-full'>
                <NewPost currentUser={currentUserInfo} />
                <div className='show'>
                  {allNewsfeedPosts.map((item, index) => {
                    return (
                      <div key={item._id}>
                        {index === allNewsfeedPosts.length - 3 && (
                          <div className='absolute h-[130rem] w-full' ref={bottomRef} />
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
                  {isFetchingNextNewsfeedPosts && (
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
              <div className='news-feed-right w-4/12 pl-3 md:hidden'>
                <Affix offsetTop={100}>
                  <div key={popularvalue}>
                    <div
                      className='popular-post flex justify-between items-center'
                      style={{
                        backgroundColor: themeColorSet.colorBg2,
                        borderStartStartRadius: 10,
                        borderStartEndRadius: 10,
                        padding: 10
                      }}>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          color: themeColorSet.colorText1
                        }}>
                        Popular Posts
                      </span>
                      <Dropdown
                        placement='bottom'
                        menu={{
                          items: popular_time,
                          onClick: handlePopularClick
                        }}
                        trigger={['click']}
                        onOpenChange={handleOpenPopularChange}
                        open={popularOpen}>
                        <Space
                          style={{
                            marginRight: 15,
                            fontWeight: 600,
                            fontSize: 16,
                            color: themeColorSet.colorText1,
                            cursor: 'pointer'
                          }}>
                          <span
                            style={{
                              fontSize: '0.9rem',
                              color: themeColorSet.colorText2
                            }}>
                            {popularvalue}
                          </span>
                          <DownOutlined
                            style={{
                              fontSize: '0.7rem',
                              transform: popularOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: popularOpen ? 'transform 0.3s' : 'transform 0.3s 0.3s'
                            }}
                          />
                        </Space>
                      </Dropdown>
                    </div>
                    <div
                      className='popular-post-body flex flex-col'
                      style={{
                        backgroundColor: themeColorSet.colorBg2,
                        borderEndEndRadius: 10,
                        borderEndStartRadius: 10,
                        padding: 10
                      }}>
                      {isNoPopularPosts ? (
                        <div className='flex justify-center items-center no-post'>
                          <span
                            style={{
                              fontSize: '1.2rem',
                              fontWeight: 600,
                              color: themeColorSet.colorText1
                            }}>
                            No popular post {popularvalue === 'All time' && 'for '}
                            {popularvalue.toLowerCase()}
                          </span>
                        </div>
                      ) : isFetchingAllPopularPosts || isLoadingAllPopularPosts ? (
                        <>
                          <Skeleton active avatar paragraph={{ rows: 2 }} />
                          <Skeleton active avatar paragraph={{ rows: 2 }} />
                          <Skeleton active avatar paragraph={{ rows: 2 }} />
                        </>
                      ) : (
                        popular.map((item) => (
                          <NavLink key={item._id + 'popular'} to={`/post/${item._id}`}>
                            <div className='popular-post-item flex rounded-lg items-center pt-3 pb-3'>
                              <img
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  marginLeft: 10,
                                  objectFit: 'cover'
                                }}
                                className='popular-post-item-image'
                                src={getImageURL(item.post_attributes.user.user_image, 'avatar_mini')}
                              />
                              <div className='content ml-4'>
                                <div
                                  className='name'
                                  style={{
                                    color: themeColorSet.colorText1,
                                    fontWeight: 600
                                  }}>
                                  <span>{item.post_attributes.user.name}</span>
                                </div>
                                <div
                                  className='popular-post-item-desc mt-1'
                                  style={{
                                    color: themeColorSet.colorText2,
                                    fontSize: '0.9rem'
                                  }}>
                                  <span>
                                    {item.post_attributes.title?.length! > 50 &&
                                    item.post_attributes.title?.length! > 65
                                      ? item.post_attributes.title!.slice(0, 50) + '...'
                                      : item.post_attributes.title}
                                  </span>
                                </div>
                                <div className='popular-post-item-view mt-1'>
                                  <FontAwesomeIcon
                                    icon={faFileLines}
                                    style={{
                                      color: themeColorSet.colorText3,
                                      fontSize: '0.9rem'
                                    }}
                                  />
                                  <span
                                    style={{
                                      marginLeft: 5,
                                      color: themeColorSet.colorText3
                                    }}>
                                    {ConvertNumber(item.post_attributes.view_number)} view
                                    {item.post_attributes.view_number > 0 && 's'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </NavLink>
                        ))
                      )}
                    </div>
                    {/* <div
                      className='top-community mt-3'
                      style={{
                        backgroundColor: themeColorSet.colorBg2,
                        borderRadius: 10,
                        padding: 10
                      }}>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          color: themeColorSet.colorText1
                        }}>
                        Top Communities
                      </span>
                      <div className='top-community-body mt-4'>
                        {community.map((item, index) => {
                          if (index > 2) {
                            return;
                          } else {
                            return (
                              <div
                                key={index}
                                className='top-community-item flex rounded-lg items-center pt-3 pb-3'>
                                <img
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 50,
                                    marginLeft: 10,
                                    objectFit: 'cover'
                                  }}
                                  className='top-community-item-image'
                                  src={item.image}
                                  alt=''
                                />
                                <div className='content ml-3  '>
                                  <div
                                    className='name'
                                    style={{
                                      color: themeColorSet.colorText1,
                                      fontWeight: 600
                                    }}>
                                    <span>{item.name}</span>
                                  </div>
                                  <div
                                    className='popular-post-item-desc mt-1'
                                    style={{
                                      color: themeColorSet.colorText2,
                                      fontSize: '0.9rem'
                                    }}>
                                    {item.description.length > 28
                                      ? item.description.slice(0, 28) + '...'
                                      : item.description}
                                  </div>
                                  <div className='top-community-item-member mt-1'>
                                    <FontAwesomeIcon
                                      icon={faUserFriends}
                                      style={{
                                        color: themeColorSet.colorText3,
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                    <span
                                      style={{
                                        marginLeft: 5,
                                        color: themeColorSet.colorText3
                                      }}>
                                      {item.member} members
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div> */}
                  </div>
                </Affix>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </StyleProvider>
  );
};

export default NewsFeed;
