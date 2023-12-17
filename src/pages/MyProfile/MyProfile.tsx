import { useCallback, useEffect, useRef } from 'react';
import { Avatar, Col, Empty, Image, Row, Space, Tabs, Tag } from 'antd';
import ReactQuill from 'react-quill';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSnowflake,
  faFileLines,
  faLocationDot,
  faBriefcase,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faGithub,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
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
import getImageURL from '@/util/getImageURL';
import { useAppDispatch, useAppSelector, useIntersectionObserver } from '@/hooks/special';
import { useCurrentUserInfo, useUserPostsData } from '@/hooks/fetch';

import StyleProvider from './cssMyProfile';

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const userID = useAppSelector((state) => state.auth.userID);

  const isMdScreen = useMediaQuery({ maxWidth: 1023 });

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  const { currentUserInfo } = useCurrentUserInfo();

  const { isLoadingUserPosts, userPosts, isFetchingNextUserPosts, hasNextUserPosts, fetchNextUserPosts } =
    useUserPostsData(userID);

  const experiences = currentUserInfo.experiences;

  const positionNames = experiences?.map((experience) => experience.position_name);

  const jobPosition =
    positionNames?.length > 0
      ? positionNames.length > 2
        ? positionNames.slice(0, 2).join(' & ')
        : positionNames.join(' & ')
      : 'No job position';

  const iconMap: Record<string, IconDefinition> = {
    '0': faFacebookF,
    '1': faGithub,
    '2': faTwitter,
    '3': faInstagram,
    '4': faLinkedin
  };

  const fetchNextPosts = useCallback(() => {
    if (hasNextUserPosts && !isFetchingNextUserPosts) {
      fetchNextUserPosts();
    }
  }, [hasNextUserPosts, isFetchingNextUserPosts]);

  useIntersectionObserver(bottomRef, fetchNextPosts, { threshold: 0 });

  useEffect(() => {
    if (isLoadingUserPosts) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isLoadingUserPosts]);

  useEffect(() => {
    document.title = `${currentUserInfo.name} - DevHub`;
  }, []);

  return (
    <StyleProvider theme={themeColorSet}>
      {isLoadingUserPosts ? (
        <LoadingProfileComponent />
      ) : (
        <Row>
          <Col span={24} className='avatar_cover relative'>
            <div className='cover flex justify-center items-center w-full h-96 overflow-hidden md:h-60 rounded-br-lg rounded-bl-lg'>
              <Image
                src={getImageURL(currentUserInfo.cover_image) ?? '/images/ProfilePage/cover.jpg'}
                preview={{ mask: <FontAwesomeIcon icon={faEye} /> }}
                alt='avt'
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='avatar rounded-full overflow-hidden flex w-44 h-44 -bottom-[30%] left-[15%] md:left-10 md:w-36 md:h-36 md:-bottom-20'>
              <Image
                src={getImageURL(currentUserInfo.user_image, 'avatar')}
                alt='avt'
                style={{ objectFit: 'cover' }}
                preview={{
                  src: getImageURL(currentUserInfo.user_image),
                  mask: <FontAwesomeIcon icon={faEye} />
                }}
              />
            </div>
          </Col>
          <Col offset={isMdScreen ? 0 : 3} span={isMdScreen ? 24 : 18}>
            <Row className='py-5 name_Editprofile'>
              <Col offset={6} span={isMdScreen ? 12 : 12}>
                <div className='text-2xl font-bold' style={{ color: themeColorSet.colorText1 }}>
                  {currentUserInfo.name}
                </div>
                <div className='position mt-2'>
                  <FontAwesomeIcon className='icon' icon={faSnowflake} />
                  <span style={{ color: themeColorSet.colorText3 }} className='ml-2'>
                    {jobPosition}
                  </span>
                </div>
                <div className='viewResume mt-2'>
                  <FontAwesomeIcon className='icon' icon={faFileLines} />
                  <NavLink to='/resume' className='ml-2'>
                    View Resume
                  </NavLink>
                </div>
              </Col>
              <Col span={isMdScreen ? 1 : 6}>
                <div className='chat_Follow flex justify-around items-center md:items-start w-full h-full'>
                  <div className='editProfile'>
                    <button
                      className='btnEditProfile px-6 py-3 rounded-full md:w-32'
                      onClick={() => {
                        dispatch(
                          openDrawer({
                            title: 'Edit Profile',
                            component: <EditProfileForm key={uuidv4().replace(/-/g, '')} />
                          })
                        );
                      }}>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
            <div className='id_address_join md:pl-3'>
              <span className='id item mr-2'>@{currentUserInfo.alias || 'user'}</span>
              <span className='address item mr-2'>
                <FontAwesomeIcon className='icon mr-2' icon={faLocationDot} />
                {currentUserInfo.location || 'Global'}
              </span>
              <span className='join'>
                <FontAwesomeIcon className='icon mr-2' icon={faBriefcase} />
                Joined {format(new Date(currentUserInfo.createdAt), 'MMM yyyy')}
              </span>
            </div>
            <Col span={18} className='mt-5'>
              <div className='tags flex flex-wrap md:pl-1'>
                {descArray.map((item, index) => {
                  if (currentUserInfo.tags?.indexOf(item.title) !== -1) {
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
            <div className='follow mt-5 md:pl-3'>
              <span className='follower item mr-2'>
                <span className='mr-1'>{currentUserInfo?.friend_number ?? 0}</span>&nbsp;
                {currentUserInfo?.friend_number > 1 ? 'Friends' : 'Friend'}
              </span>
              {/* <span className='following item mr-2'>
                <span className='mr-1'>{currentUserInfo?.pendingFriend_number ?? 0}</span>&nbsp;
                {currentUserInfo?.pendingFriend_number > 1 ? 'Followings' : 'Following'}
              </span> */}
              <span className='post mr-2'>
                <span className='mr-1'>{currentUserInfo?.post_number ?? 0}</span>&nbsp;
                {currentUserInfo?.post_number > 1 ? 'Posts' : 'Post'}
              </span>
            </div>
            <div className='experience mt-5 md:pl-1'>
              {currentUserInfo.experiences.map((item, index) => (
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
            <div className='contact mt-5 md:pl-1'>
              <Space>
                {currentUserInfo.contacts.map((item, index) => {
                  return (
                    <Avatar
                      key={index}
                      style={{ color: themeColorSet.colorText1 }}
                      onClick={() => {
                        openInNewTab(item.link);
                      }}
                      className='item'
                      icon={<FontAwesomeIcon icon={iconMap[item.key]} />}
                    />
                  );
                })}
              </Space>
            </div>
            <div className='mainContain mt-5 '>
              <Tabs
                centered={isMdScreen ? true : false}
                className='mainContain__tab'
                tabBarStyle={
                  isMdScreen
                    ? {
                        paddingLeft: '4px'
                      }
                    : {}
                }
                defaultActiveKey='2'
                items={[
                  {
                    key: '1',
                    label: 'Introduction',
                    children: (
                      <div className='mt-10 mb-20'>
                        {!currentUserInfo.about && currentUserInfo.repositories.length === 0 && (
                          <div className='w-8/12 mb-10 md:w-full'>
                            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description='No introduction' />
                          </div>
                        )}
                        {currentUserInfo.about && (
                          <div className='w-8/12 mb-10 md:w-full'>
                            <div
                              style={{
                                color: themeColorSet.colorText1,
                                fontWeight: 600,
                                fontSize: '1.2rem'
                              }}>
                              About
                            </div>
                            <ReactQuill value={currentUserInfo.about} readOnly theme='bubble' />
                          </div>
                        )}
                        {currentUserInfo.repositories.length !== 0 && (
                          <div className='w-8/12 mt-5 md:w-full'>
                            <div
                              style={{
                                color: themeColorSet.colorText1,
                                fontWeight: 600,
                                fontSize: '1.2rem'
                              }}>
                              Repositories
                            </div>
                            <div className='flex flex-wrap justify-between mt-5'>
                              {currentUserInfo.repositories.map((item, index) => {
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
                      <div className='mt-5 w-8/12 md:w-full'>
                        <NewPost currentUser={currentUserInfo} />
                        {userPosts.length === 0 ? (
                          <Empty
                            className='mt-10 mb-20'
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                            description='No posts available'
                          />
                        ) : (
                          userPosts.map((item, index) => (
                            <div key={item._id} className='relative'>
                              {index === userPosts.length - 3 && (
                                <div className='absolute h-[130rem] w-full' ref={bottomRef} />
                              )}
                              {item.type === 'Share' ? (
                                <MyPostShare
                                  postShared={item}
                                  postAuthor={currentUserInfo}
                                  postSharer={item.post_attributes.owner_post!}
                                />
                              ) : (
                                <MyPost post={item} postAuthor={currentUserInfo} />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )
                  },
                  {
                    key: '3',
                    label: 'Show',
                    children: <>Show</>,
                    disabled: true
                  },
                  {
                    key: '4',
                    label: 'Seri',
                    children: <>Seri</>,
                    disabled: true
                  },
                  {
                    key: '5',
                    label: 'Guestbook',
                    children: <>Guestbook</>,
                    disabled: true
                  }
                ]}
              />
            </div>
          </Col>
        </Row>
      )}
    </StyleProvider>
  );
};

export default MyProfile;
