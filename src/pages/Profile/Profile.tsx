import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Col, Empty, Image, Row, Space, Tabs, Tag } from 'antd';
import ReactQuill from 'react-quill';
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

import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import LoadingProfileComponent from '@/components/Loading/LoadingProfile';
import { ButtonActiveHover } from '@/components/MiniComponent';
import RenderRepositoryIem from '@/components/ActionComponent/RenderRepositoryIem';

import descArray from '@/util/Descriptions/Tags';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import getImageURL from '@/util/getImageURL';

import { useOtherUserInfo, useCurrentUserInfo, useUserPostsData } from '@/hooks/fetch';
import { useAppSelector, useIntersectionObserver } from '@/hooks/special';
import { useAddFriendUser, useAcceptFriendUser } from '@/hooks/mutation';
import { IExperience } from '@/types';
import StyleProvider from './cssProfile';

interface IProfile {
  userID: string;
}

const Profile = ({ userID }: IProfile) => {
  const isMdScreen = useMediaQuery({ maxWidth: 1023 });

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const bottomRef = useRef<HTMLDivElement>(null);

  const { mutateAddFriendUser: mutateAddFriendUser, isLoadingAddFriendUser: isLoadingAddFriendUser } =
    useAddFriendUser();

  const {
    mutateAcceptFriendUser: mutateAcceptFriendUser,
    isLoadingAcceptFriendUser: isLoadingAcceptFriendUser
  } = useAcceptFriendUser();

  const { otherUserInfo, isLoadingOtherUserInfo } = useOtherUserInfo(userID);

  const { currentUserInfo } = useCurrentUserInfo();

  const sentRequest = useMemo(() => {
    if (currentUserInfo && otherUserInfo) {
      return currentUserInfo.requestSent.indexOf(otherUserInfo._id) !== -1;
    }
    return false;
  }, [currentUserInfo, otherUserInfo]);

  const receivedRequest = useMemo(() => {
    if (currentUserInfo && otherUserInfo) {
      return currentUserInfo.requestReceived.indexOf(otherUserInfo._id) !== -1;
    }
    return false;
  }, [currentUserInfo, otherUserInfo]);

  console.log(currentUserInfo, otherUserInfo)

  const { isLoadingUserPosts, userPosts, isFetchingNextUserPosts, hasNextUserPosts, fetchNextUserPosts } =
    useUserPostsData(userID);

  const [experiences, setExperiences] = useState<IExperience[]>([]);

  const positionNames = experiences.map((experience) => experience.position_name);

  const jobPosition =
    positionNames.length > 0
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

  useEffect(() => {
    if (isLoadingUserPosts) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isLoadingUserPosts]);

  const [isPendingFriend, setIsPendingFriend] = useState(false);
  useEffect(() => {
    setIsPendingFriend(otherUserInfo?.is_friend);
  }, [otherUserInfo]);

  console.log(isPendingFriend, sentRequest, receivedRequest);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const fetchNextPosts = useCallback(() => {
    if (hasNextUserPosts && !isFetchingNextUserPosts) {
      fetchNextUserPosts();
    }
  }, [hasNextUserPosts, isFetchingNextUserPosts]);

  useIntersectionObserver(bottomRef, fetchNextPosts, { threshold: 0 });

  useEffect(() => {
    document.title = isLoadingOtherUserInfo ? 'DevHub' : `${otherUserInfo.name} - DevHub`;
    if (!isLoadingOtherUserInfo && otherUserInfo) {
      setExperiences(otherUserInfo?.experiences ?? []);
    }
  }, [isLoadingOtherUserInfo, otherUserInfo]);

  return (
    <StyleProvider theme={themeColorSet}>
      {isLoadingUserPosts || isLoadingOtherUserInfo ? (
        <LoadingProfileComponent />
      ) : (
        <Row>
          <Col span={24} className='avatar_cover relative'>
            <div className='cover flex justify-center items-center w-full h-96 overflow-hidden md:h-40 rounded-br-lg rounded-bl-lg'>
              <Image
                src={getImageURL(otherUserInfo.cover_image) ?? '/images/ProfilePage/cover.jpg'}
                preview={{ mask: <FontAwesomeIcon icon={faEye} /> }}
                alt='avt'
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='avatar rounded-full overflow-hidden flex w-44 h-44 -bottom-[30%] left-[15%] md:left-3 md:w-28 md:h-28 md:-bottom-8'>
              <Image
                src={getImageURL(otherUserInfo.user_image, 'avatar')}
                alt='avt'
                style={{ objectFit: 'cover' }}
                preview={{
                  src: getImageURL(otherUserInfo.user_image),
                  mask: <FontAwesomeIcon icon={faEye} />
                }}
              />
            </div>
          </Col>
          <Col offset={isMdScreen ? 0 : 3} span={isMdScreen ? 24 : 18}>
            <Row className='py-5 md:pt-8'>
              <Col offset={isMdScreen ? 1 : 6} span={isMdScreen ? 16 : 12}>
                <div className='text-2xl font-bold' style={{ color: themeColorSet.colorText1 }}>
                  {otherUserInfo.name}
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
              <Col span={6}>
                <div className='chat_Follow flex justify-around items-center w-full h-full'>
                  <ButtonActiveHover
                    className='follow px-6 h-11 border-2 border-solid'
                    type='default'
                    loading={isLoadingAddFriendUser}
                    onClick={() => {
                      receivedRequest ? mutateAcceptFriendUser(userID) : mutateAddFriendUser(userID);
                    }}>
                    {isPendingFriend
                      ? 'Unfriend'
                      : sentRequest
                      ? 'Cancel Request'
                      : receivedRequest
                      ? 'Accept'
                      : 'Add Friend'}
                  </ButtonActiveHover>
                </div>
              </Col>
            </Row>
            <div className='id_address_join md:pl-3'>
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
            <Col span={isMdScreen ? 24 : 18} className='mt-5'>
              <div className='tags flex flex-wrap md:pl-1 md:w-full'>
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
            <div className='follow mt-5 md:pl-3'>
              <span className='follower item mr-2'>
                <span className='mr-1'>{otherUserInfo?.friend_number ?? 0}</span>&nbsp;
                {otherUserInfo?.friend_number > 1 ? 'Friends' : 'Friend'}
              </span>
              {/* <span className='following item mr-2'>
                <span className='mr-1'>{otherUserInfo?.pendingFriend_number ?? 0}</span>&nbsp;
                {otherUserInfo?.pendingFriend_number > 1 ? 'Followings' : 'Following'}
              </span> */}
              <span className='post mr-2'>
                <span className='mr-1'>{otherUserInfo?.post_number ?? 0}</span>&nbsp;
                {otherUserInfo?.post_number > 1 ? 'Posts' : 'Post'}
              </span>
            </div>
            <div className='experience mt-5 md:pl-1'>
              {otherUserInfo.experiences.map((item, index) => (
                <div className='item mt-2' key={index}>
                  <FontAwesomeIcon
                    className='icon mr-2'
                    icon={faBriefcase}
                    style={{ color: commonColor.colorBlue1 }}
                  />
                  <span className='company mr-2'>{item.company_name}</span>
                  {isMdScreen && <br />}
                  <span className='position mr-2'>{item.position_name} |</span>
                  <span className='date'>
                    {item.start_date} ~ {item.end_date}
                  </span>
                </div>
              ))}
            </div>
            <div className='contact mt-5 md:pl-1'>
              <Space>
                {otherUserInfo.contacts.map((item, index) => {
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
                          <div className='w-8/12 mb-10 md:w-full'>
                            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description='No introduction' />
                          </div>
                        )}
                        {otherUserInfo.about && (
                          <div className='w-8/12 md:w-full'>
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
                      <div className='mt-5 w-8/12 md:w-full'>
                        {userPosts.length === 0 ? (
                          <Empty
                            className='mt-10 mb-20'
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                            description='No posts available'
                          />
                        ) : (
                          userPosts.map((item, index) => (
                            <div className='relative' key={item._id}>
                              {index === userPosts.length - 3 && (
                                <div className='absolute h-[130rem] w-full' ref={bottomRef} />
                              )}
                              {item.type === 'Share' ? (
                                <OtherPostShare
                                  postShared={item}
                                  postAuthor={otherUserInfo}
                                  postSharer={item.post_attributes.owner_post!}
                                  currentUser={currentUserInfo}
                                />
                              ) : (
                                <OtherPost
                                  post={item}
                                  postAuthor={otherUserInfo}
                                  currentUser={currentUserInfo}
                                />
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

export default Profile;
