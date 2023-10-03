import { useEffect, useState } from 'react';
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
import { useMediaQuery } from 'react-responsive';
import { format } from 'date-fns';
import 'react-quill/dist/quill.bubble.css';

import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import LoadingProfileComponent from '@/components/Loading/LoadingProfile';
import RenderRepositoryIem from '@/components/ActionComponent/RenderRepositoryIem';

import descArray from '@/util/Descriptions/Tags';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';

import { useOtherUserInfo, useUserPostsData } from '@/hooks/fetch';
import { useAppSelector } from '@/hooks/special';
import { useFollowUser } from '@/hooks/mutation';
import StyleProvider from './cssProfile';

interface Props {
  userID: string;
}

const Profile = (Props: Props) => {
  const { userID } = Props;

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateFollowUser } = useFollowUser();

  const { isLoadingUserPosts, userPosts, isFetchingUserPosts } = useUserPostsData(userID);

  useEffect(() => {
    if (isLoadingUserPosts) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isLoadingUserPosts]);

  const { otherUserInfo, isLoadingOtherUserInfo } = useOtherUserInfo(userID);

  // isShared
  const [isFollowing, setIsFollowing] = useState(true);
  useEffect(() => {
    setIsFollowing(otherUserInfo?.is_followed);
  }, [otherUserInfo]);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  useEffect(() => {
    document.title = isLoadingOtherUserInfo ? 'DevHub' : `${otherUserInfo?.name} | DevHub`;
  }, [isLoadingOtherUserInfo]);

  return (
    <StyleProvider theme={themeColorSet}>
      {!userPosts || !otherUserInfo || isLoadingUserPosts || isFetchingUserPosts || isLoadingOtherUserInfo ? (
        <LoadingProfileComponent />
      ) : (
        <>
          <Row>
            <Col span={24} className='avatar_cover relative'>
              <div
                className='cover w-full h-80 xs:h-40 rounded-br-lg rounded-bl-lg'
                style={{
                  backgroundImage: `url("${otherUserInfo.cover_image || `/images/ProfilePage/cover.jpg`}")`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}></div>
              <div className='avatar rounded-full overflow-hidden object-cover flex w-44 h-44 -bottom-24 left-60 xs:left-3 xs:w-28 xs:h-28 xs:-bottom-8'>
                <Image
                  src={otherUserInfo.user_image || '/images/DefaultAvatar/default_avatar.png'}
                  preview={otherUserInfo.user_image ? true : false}
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
              <Row className='py-5 xs:pt-8'>
                <Col offset={isXsScreen ? 1 : 6} span={isXsScreen ? 16 : 12}>
                  <div className='text-2xl font-bold' style={{ color: themeColorSet.colorText1 }}>
                    {otherUserInfo.name}
                  </div>
                  <div className='position mt-2'>
                    <FontAwesomeIcon className='icon' icon={faSnowflake} />
                    <span style={{ color: themeColorSet.colorText3 }} className='ml-2'>
                      {otherUserInfo.experiences && otherUserInfo.experiences.length > 0
                        ? otherUserInfo.experiences.length > 1
                          ? otherUserInfo.experiences[0].position_name +
                            ' & ' +
                            otherUserInfo.experiences[1].position_name
                          : otherUserInfo.experiences[0].position_name
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
                <Col span={6}>
                  <div className='chat_Follow flex justify-around items-center w-full h-full'>
                    <div
                      className='follow px-4 py-2 rounded-full'
                      onClick={() => {
                        setIsFollowing(!isFollowing);
                        mutateFollowUser(userID);
                      }}>
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className='id_address_join xs:pl-3'>
                <span className='id item mr-2'>@{otherUserInfo.alias || 'user'}</span>
                <span className='address item mr-2'>
                  <FontAwesomeIcon className='icon mr-2' icon={faLocationDot} />
                  {otherUserInfo.location || 'Global'}
                </span>
                <span className='join'>
                  <FontAwesomeIcon className='icon mr-2' icon={faBriefcase} />
                  Joined {format(new Date(otherUserInfo.createdAt), 'MMM yyyy')}
                </span>
              </div>
              <Col span={isXsScreen ? 24 : 18} className='mt-5'>
                <div className='tags flex flex-wrap xs:pl-1 xs:w-full'>
                  {descArray.map((item, index) => {
                    if (otherUserInfo.tags?.indexOf(item.title) !== -1) {
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
              <div className='follow mt-5 xs:pl-3'>
                <span className='follower item mr-2'>
                  <span className='mr-1'>{otherUserInfo?.follower_number || 0}</span>{' '}
                  {otherUserInfo?.follower_number > 1 ? 'Followers' : 'Follower'}
                </span>
                <span className='following item mr-2'>
                  <span className='mr-1'>{otherUserInfo?.following_number || 0}</span>{' '}
                  {otherUserInfo?.following_number > 1 ? 'Followings' : 'Following'}
                </span>
                <span className='post mr-2'>
                  <span className='mr-1'>{otherUserInfo?.post_number || 0}</span>{' '}
                  {otherUserInfo?.post_number > 1 ? 'Posts' : 'Post'}
                </span>
              </div>
              <div className='experience mt-5 xs:pl-1'>
                {otherUserInfo.experiences.map((item, index) => (
                  <div className='item mt-2' key={index}>
                    <FontAwesomeIcon
                      className='icon mr-2'
                      icon={faBriefcase}
                      style={{ color: commonColor.colorBlue1 }}
                    />
                    <span className='company mr-2'>{item.company_name}</span>
                    {isXsScreen && <br />}
                    <span className='position mr-2'>{item.position_name} |</span>
                    <span className='date'>
                      {item.start_date} ~ {item.end_date}
                    </span>
                  </div>
                ))}
              </div>
              <div className='contact mt-5 xs:pl-1'>
                <Space>
                  {otherUserInfo.contacts.map((item, index) => {
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
                          {!otherUserInfo.about && otherUserInfo.repositories.length === 0 && (
                            <div className='w-8/12 mb-10 xs:w-full'>
                              <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description='No introduction' />
                            </div>
                          )}
                          {otherUserInfo.about && (
                            <div className='w-8/12 xs:w-full'>
                              <div
                                style={{
                                  color: themeColorSet.colorText1,
                                  fontWeight: 600,
                                  fontSize: '1.2rem'
                                }}>
                                About
                              </div>
                              <ReactQuill value={otherUserInfo.about} readOnly theme='bubble' />
                            </div>
                          )}
                          {otherUserInfo.repositories.length !== 0 && (
                            <div className='w-8/12 mt-5 xs:w-full'>
                              <div
                                style={{
                                  color: themeColorSet.colorText1,
                                  fontWeight: 600,
                                  fontSize: '1.2rem'
                                }}>
                                Repositories
                              </div>
                              <div className='flex flex-wrap justify-between mt-5'>
                                {otherUserInfo.repositories.map((item, index) => {
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
                        <div className='mt-5 w-8/12 xs:w-full'>
                          {userPosts.length === 0 && (
                            <Empty
                              className='mt-10 mb-20'
                              image={Empty.PRESENTED_IMAGE_DEFAULT}
                              description='No posts available'
                            />
                          )}
                          {userPosts.map((item) =>
                            item.type === 'Share' ? (
                              <OtherPostShare
                                key={item._id}
                                postShared={item}
                                userInfo={otherUserInfo}
                                ownerInfo={item.post_attributes.owner_post!}
                              />
                            ) : (
                              <OtherPost key={item._id} post={item} userInfo={otherUserInfo} />
                            )
                          )}
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

export default Profile;
