import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Col, ConfigProvider, Dropdown, MenuProps, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { DownOutlined } from '@ant-design/icons';

import OtherPostShare from '@/components/Post/OtherPostShare';
import NewPost from '@/components/NewPost';
import OtherPost from '@/components/Post/OtherPost';
import LoadingNewFeed from '@/components/GlobalSetting/LoadingNewFeed';

import { getTheme } from '@/util/functions/ThemeFunction';
import { setIsInProfile } from '@/redux/Slice/PostSlice';
import { useAllPostsData } from '@/hooks';
import { AppDispatch, RootState } from '@/redux/configStore';

import StyleTotal from './cssNewsFeed';

const popular_time = [
  {
    label: 'To Day',
    key: '1'
  },
  {
    label: 'Week',
    key: '2'
  },
  {
    label: 'Month',
    key: '3'
  }
];

const community = [
  {
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGiauApOpu95sj6IxatDeXrrAfCVznCpX41g&usqp=CAU',
    name: 'Water Cooler chats',
    description:
      'Hang out and chat with your fellow developers in this general community',
    member: 3760
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png',
    name: 'Water Cooler chats',
    description:
      'Hang out and chat with your fellow developers in this general community',
    member: 1376
  },
  {
    image:
      'https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
    name: 'Water Cooler chats',
    description:
      'Hang out and chat with your fellow developers in this general community',
    member: 13154
  },
  {
    image:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
    name: 'Water Cooler chats',
    description:
      'Hang out and chat with your fellow developers in this general community',
    member: 3757
  },
  {
    image:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
    name: 'Water Cooler chats',
    description:
      'Hang out and chat with your fellow developers in this general community',
    member: 7573
  },
  {
    image:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
    name: 'Water Cooler chats',
    description:
      'Hang out and chat with your fellow developers in this general community',
    member: 9343
  }
];

const NewFeed = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useEffect(() => {
    dispatch(setIsInProfile(false));
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const { isLoading, isFetching, allPost, userInfo } = useAllPostsData();

  const popular = [...allPost!]
    .filter((item) => item.type !== 'Share')
    .sort(
      (a, b) => b.post_attributes.view_number - a.post_attributes.view_number
    )
    .slice(0, 3);

  const [popularOpen, setPopularOpen] = useState(false);
  const [popularvalue, setPopularvalue] = useState('To Day');

  const handlePopularClick: MenuProps['onClick'] = (e) => {
    const a = popular_time.find((item) => item.key === e.key);
    setPopularvalue(a?.label || popularvalue);
    setPopularOpen(false);
  };

  const handleOpenPopularChange = (flag: boolean) => {
    setPopularOpen(flag);
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {!allPost ||
        !userInfo ||
        !popular ||
        !community ||
        isLoading ||
        isFetching ? (
          <LoadingNewFeed />
        ) : (
          <Row>
            <Col offset={3} span={18}>
              <div className="new-feed flex justify-between mt-10">
                <div className="new-feed-left w-8/12">
                  <div className="">
                    <NewPost userInfo={userInfo} />
                  </div>

                  <div className="show">
                    {allPost.map((item, index) => {
                      return (
                        <div key={index}>
                          {!item.hasOwnProperty('PostShared') && (
                            <OtherPost
                              key={item.id}
                              post={item}
                              userInfo={item.post_attributes.user}
                            />
                          )}
                          {item.hasOwnProperty('PostShared') && (
                            <OtherPostShare
                              key={item.id}
                              post={item}
                              userInfo={item.post_attributes.user}
                              owner={item.post_attributes.owner_post}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="new-feed-right w-4/12 pl-3">
                  <div
                    className="popular-post flex justify-between items-center"
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
                      Popular Post
                    </span>

                    <Dropdown
                      menu={{
                        items: popular_time,
                        onClick: handlePopularClick
                      }}
                      trigger={['click']}
                      onOpenChange={handleOpenPopularChange}
                      open={popularOpen}>
                      <div onClick={(e) => e.preventDefault()}>
                        <Space
                          style={{
                            maxWidth: 100,
                            width: 100,
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
                          <DownOutlined style={{ fontSize: '0.7rem' }} />
                        </Space>
                      </div>
                    </Dropdown>
                  </div>
                  <div
                    className="popular-post-body"
                    style={{
                      backgroundColor: themeColorSet.colorBg2,
                      borderEndEndRadius: 10,
                      padding: 10
                    }}>
                    {popular.map((item, index) => {
                      return (
                        <div key={index}>
                          <NavLink to={`/post/${item.id}`}>
                            <div
                              className="popular-post-item flex items-center pt-3 pb-3"
                              style={{
                                borderBottom: '1px solid',
                                borderColor: themeColorSet.colorBg4
                              }}>
                              <img
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  marginLeft: 10,
                                  objectFit: 'cover'
                                }}
                                className="popular-post-item-image"
                                src={`${item.post_attributes.user.user_image}`}
                                alt=""
                              />
                              <div className="content ml-4  ">
                                <div
                                  className="name"
                                  style={{
                                    color: themeColorSet.colorText1,
                                    fontWeight: 600
                                  }}>
                                  <span>
                                    {item.post_attributes.user.lastname}
                                  </span>
                                </div>
                                <div
                                  className="popular-post-item-desc mt-1"
                                  style={{
                                    color: themeColorSet.colorText2,
                                    fontSize: '0.9rem'
                                  }}>
                                  <span>
                                    {item.post_attributes.title?.length! > 28
                                      ? item.post_attributes.title?.slice(
                                          0,
                                          28
                                        ) + '...'
                                      : item.post_attributes.title}
                                  </span>
                                </div>
                                <div className="popular-post-item-view mt-1">
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
                                    {item.post_attributes.view_number}{' '}
                                    {item.post_attributes.view_number! > 0
                                      ? 'Views'
                                      : 'View'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </NavLink>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="top-community mt-3"
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

                    <div className="top-community-body mt-4">
                      {community.map((item, index) => {
                        if (index > 2) {
                          return;
                        } else {
                          return (
                            <>
                              <div
                                className="top-community-item flex pt-3 pb-3"
                                style={{
                                  borderBottom: '1px solid',
                                  borderColor: themeColorSet.colorBg4
                                }}>
                                <img
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 50
                                  }}
                                  className="top-community-item-image"
                                  src={`${item.image}`}
                                  alt=""
                                />
                                <div className="content ml-3  ">
                                  <div
                                    className="name"
                                    style={{
                                      color: themeColorSet.colorText1,
                                      fontWeight: 600
                                    }}>
                                    <span>{item.name}</span>
                                  </div>
                                  <div
                                    className="popular-post-item-desc mt-1"
                                    style={{
                                      color: themeColorSet.colorText2,
                                      fontSize: '0.9rem'
                                    }}>
                                    {item.description.length > 28
                                      ? item.description.slice(0, 28) + '...'
                                      : item.description}
                                  </div>
                                  <div className="top-community-item-member mt-1">
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
                                      {item.member} Members
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </StyleTotal>
    </ConfigProvider>
  );
};

export default NewFeed;
