import { useEffect } from 'react';
import { Avatar, Col, Empty, Image, Row, Space, Tabs, Tag } from 'antd';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake, faFileLines, faLocationDot, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faGithub,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { NavLink } from 'react-router-dom';
import { format } from 'date-fns';
import 'react-quill/dist/quill.bubble.css';

import descArray from '@/util/Descriptions/Tags';
import NewPost from '@/components/NewPost';
import EditProfileForm from '@/components/Form/EditProfileForm';
import LoadingProfileComponent from '@/components/Loading/LoadingProfile';
import RenderRepositoryIem from '@/components/ActionComponent/RenderRepositoryIem';
import MyPostShare from '@/components/Post/MyPostShare';
import MyPost from '@/components/Post/MyPost';

import { openDrawer } from '@/redux/Slice/DrawerHOCSlice';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useUserInfo, useUserPostsData } from '@/hooks/fetch';

import { useMediaQuery } from "react-responsive";

import StyleProvider from './cssMyProfile';

const MyProfile = () => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const { isLoadingUserPosts, userPosts, isFetchingUserPosts } = useUserPostsData('me');

  useEffect(() => {
    if (isLoadingUserPosts) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [isLoadingUserPosts]);

  const { userInfo, isLoadingUserInfo } = useUserInfo();

  useEffect(() => {
    document.title = isLoadingUserPosts ? 'DevHub' : `${userInfo?.name} | DevHub`;
  }, [isLoadingUserPosts, isLoadingUserInfo]);
  const isXsScreen = useMediaQuery({ maxWidth: 639 });
  return (
    <StyleProvider theme={themeColorSet}>
      {!userPosts || !userInfo || isLoadingUserPosts || isFetchingUserPosts || isLoadingUserInfo ? (
        <LoadingProfileComponent />
      ) : (
        <>
          <Row>
            <Col span={24} className='avatar_cover relative'>
              <div
                className="cover w-full h-80 xs:h-40 rounded-br-lg rounded-bl-lg"
                style={{
                  backgroundImage: `url("${userInfo.cover_image || `/images/ProfilePage/cover.jpg`}")`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}></div>
              <div className="avatar rounded-full overflow-hidden object-cover flex w-44 h-44 -bottom-24 left-60 xs:left-3 xs:w-28 xs:h-28 xs:-bottom-6">
                <Image
                  src={userInfo.user_image || '/images/DefaultAvatar/default_avatar.png'}
                  alt='avt'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </Col>
            <Col offset={isXsScreen ? 0 : 3} span={isXsScreen ? 24 : 18}>
              <Row className='py-5 name_Editprofile'>
              <Col offset={isXsScreen ? 1 : 6} span={isXsScreen ? 16 : 12}>
                  <div className='text-2xl font-bold' style={{ color: themeColorSet.colorText1 }}>
                    {userInfo.name}
                  </div>
                  <div className='position mt-2'>
                    <FontAwesomeIcon className='icon' icon={faSnowflake} />
                    <span style={{ color: themeColorSet.colorText3 }} className='ml-2'>
                      {userInfo.experiences && userInfo.experiences.length > 0
                        ? userInfo.experiences.length > 1
                          ? userInfo.experiences[0].position_name +
                            ' & ' +
                            userInfo.experiences[1].position_name
                          : userInfo.experiences[0].position_name
                        : 'No job position'}
                    </span>
                  </div>
                  <div className='viewResume mt-2'>
                    <FontAwesomeIcon className='icon' icon={faFileLines} />
                    <NavLink to='/resume' className='ml-2'>
                      View Resume
                    </NavLink>
                  </div>
                </Col>
                <Col span={isXsScreen ? 5 : 6}>
                  <div className='chat_Follow flex justify-around items-center w-full h-full'>
                    <div className='editProfile'>
                      <button
                        className='btnEditProfile px-6 py-3 rounded-full xs:w-32'
                        onClick={() => {
                          dispatch(
                            openDrawer({
                              title: 'Edit Profile',
                              component: <EditProfileForm key={Math.random()} />
                            })
                          );
                        }}>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="id_address_join xs:pl-3">
                <span className='id item mr-2'>@{userInfo.alias || 'user'}</span>
                <span className='address item mr-2'>
                  <FontAwesomeIcon className='icon mr-2' icon={faLocationDot} />
                  {userInfo.location || 'Global'}
                </span>
                <span className='join'>
                  <FontAwesomeIcon className='icon mr-2' icon={faBriefcase} />
                  Joined {format(new Date(userInfo.createdAt), 'MMM yyyy')}
                </span>
              </div>
              <Col span={18} className='mt-5'>
                <div className='tags flex flex-wrap xs:pl-1'>
                  {descArray.map((item, index) => {
                    if (userInfo.tags?.indexOf(item.title) !== -1) {
                      return (
                        <Tag
                          className='item mx-2 my-2 px-4 py-1'
                          key={index}
                          color={themeColorSet.colorBg2}
                          style={{
                            border: 'none'
                          }}>
                          {item.svg} &nbsp;
                          <span style={{ color: themeColorSet.colorText1 }}>{item.title}</span>
                        </Tag>
                      );
                    }
                    return null;
                  })}
                </div>
              </Col>
              <div className="follow mt-5 xs:pl-3">
                <span className='follower item mr-2'>
                  <span className='mr-1'>{userInfo?.follower_number || 0}</span>{' '}
                  {userInfo?.follower_number > 1 ? 'Followers' : 'Follower'}
                </span>
                <span className='following item mr-2'>
                  <span className='mr-1'>{userInfo?.following_number || 0}</span>{' '}
                  {userInfo?.following_number > 1 ? 'Followings' : 'Following'}
                </span>
                <span className='post mr-2'>
                  <span className='mr-1'>{userInfo?.post_number || 0}</span>{' '}
                  {userInfo?.post_number > 1 ? 'Posts' : 'Post'}
                </span>
              </div>
              <div className='experience mt-5 xs:pl-1'>
                {userInfo.experiences.map((item, index) => (
                  <div className='item mt-2' key={index}>
                    <FontAwesomeIcon
                      className='icon mr-2'
                      icon={faBriefcase}
                      style={{ color: commonColor.colorBlue1 }}
                    />
                    <span className='company mr-2'>{item.company_name}</span>
                    <span className='position mr-2'>{item.position_name} |</span>
                    <span className='date'>
                      {item.start_date} ~ {item.end_date}
                    </span>
                  </div>
                ))}
              </div>
              <div className='contact mt-5 xs:pl-1'>
                <Space>
                  {userInfo.contacts.map((item, index) => {
                    switch (item.key) {
                      case '0':
                        return (
                          <Avatar
                            key={index}
                            style={{ color: themeColorSet.colorText1 }}
                            onClick={() => {
                              openInNewTab(item.link);
                            }}
                            className='item'
                            icon={<FontAwesomeIcon icon={faFacebookF} />}
                          />
                        );
                      case '1':
                        return (
                          <Avatar
                            key={index}
                            style={{ color: themeColorSet.colorText1 }}
                            onClick={() => {
                              openInNewTab(item.link);
                            }}
                            className='item'
                            icon={<FontAwesomeIcon icon={faGithub} />}
                          />
                        );
                      case '2':
                        return (
                          <Avatar
                            key={index}
                            style={{ color: themeColorSet.colorText1 }}
                            onClick={() => {
                              openInNewTab(item.link);
                            }}
                            className='item'
                            icon={<FontAwesomeIcon icon={faTwitter} />}
                          />
                        );
                      case '3':
                        return (
                          <Avatar
                            key={index}
                            style={{ color: themeColorSet.colorText1 }}
                            onClick={() => {
                              openInNewTab(item.link);
                            }}
                            className='item'
                            icon={<FontAwesomeIcon icon={faInstagram} />}
                          />
                        );
                      case '4':
                        return (
                          <Avatar
                            key={index}
                            style={{ color: themeColorSet.colorText1 }}
                            onClick={() => {
                              openInNewTab(item.link);
                            }}
                            className='item'
                            icon={<FontAwesomeIcon icon={faLinkedin} />}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </Space>
              </div>
              <div className='mainContain mt-5'>
                <Tabs
                  defaultActiveKey='2'
                  items={[
                    {
                      key: '1',
                      label: 'Introduction',
                      children: (
                        <div className='mt-10 mb-20'>
                          {!userInfo.about && userInfo.repositories.length === 0 && (
                            <div className="w-8/12 mb-10 xs:w-full">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_DEFAULT}
                                description={<span>No introduction</span>}
                              />
                            </div>
                          )}
                          {userInfo.about && (
                            <div className="w-8/12 mb-10 xs:w-full">
                              <div
                                style={{
                                  color: themeColorSet.colorText1,
                                  fontWeight: 600,
                                  fontSize: '1.2rem'
                                }}>
                                About
                              </div>
                              <ReactQuill value={userInfo.about} readOnly={true} theme='bubble' />
                            </div>
                          )}
                          {userInfo.repositories.length !== 0 && (
                           <div className="w-8/12 mt-5 xs:w-full">
                              <div
                                style={{
                                  color: themeColorSet.colorText1,
                                  fontWeight: 600,
                                  fontSize: '1.2rem'
                                }}>
                                Repositories
                              </div>
                              <div className='flex flex-wrap justify-between mt-5'>
                                {userInfo.repositories.map((item, index) => {
                                  return RenderRepositoryIem(item, index);
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    },
                    {
                      key: '2',
                      label: 'Posts',
                      children: (
                        <div className='mt-5'>
                          <div className="w-8/12 xs:w-full">
                            <NewPost userInfo={userInfo} />
                          </div>
                          {userPosts.length === 0 && (
                            <div className="w-8/12 xs:w-full">
                              <Empty
                                className='mt-10 mb-20'
                                image={Empty.PRESENTED_IMAGE_DEFAULT}
                                description={<span>No posts available</span>}
                              />
                            </div>
                          )}
                          {userPosts.map((item) => {
                            return (
                              <div key={item._id} className='w-8/12 xs:w-full'>
                                {item.type === 'Share' && (
                                  <MyPostShare
                                    key={item._id}
                                    postShared={item}
                                    userInfo={userInfo}
                                    ownerInfo={item.post_attributes.owner_post!}
                                  />
                                )}
                                {item.type === 'Post' && (
                                  <MyPost key={item._id} post={item} userInfo={userInfo} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )
                    },
                    {
                      key: '3',
                      label: 'Show',
                      children: <div>Show</div>,
                      disabled: true
                    },
                    {
                      key: '4',
                      label: 'Seri',
                      children: <div>Seri</div>,
                      disabled: true
                    },
                    {
                      key: '5',
                      label: 'Guestbook',
                      children: <div>Guestbook</div>,
                      disabled: true
                    }
                  ]}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
    </StyleProvider>
  );
};

export default MyProfile;
