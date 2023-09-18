import { useEffect } from 'react';
import {
  Avatar,
  Col,
  ConfigProvider,
  Empty,
  Image,
  Row,
  Space,
  Tabs,
  Tag
} from 'antd';
import ReactQuill from 'react-quill';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSnowflake,
  faFileLines,
  faLocationDot,
  faBriefcase,
  faStar,
  faCodeFork
} from '@fortawesome/free-solid-svg-icons';
import GithubColors from 'github-colors';
import {
  faFacebookF,
  faTwitter,
  faGithub,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { NavLink } from 'react-router-dom';
import 'react-quill/dist/quill.bubble.css';

import descArray from '@/components/GlobalSetting/ItemComponent/Description';
import NewPost from '@/components/NewPost';
import EditProfileForm from '@/components/Form/EditProfileForm';
import LoadingProfileComponent from '@/components/GlobalSetting/LoadingProfile';
import MyPostShare from '@/components/Post/MyPostShare';
import MyPost from '@/components/Post/MyPost';

import { GET_ALL_POST_BY_USERID_SAGA } from '@/redux/ActionSaga/PostActionSaga';
import { openDrawer } from '@/redux/Slice/DrawerHOCSlice';
import { setIsInProfile } from '@/redux/Slice/PostSlice';
import { getTheme } from '@/util/functions/ThemeFunction';
import { commonColor } from '@/util/cssVariable';
import { usePostsData } from '@/hooks';
import { RepositoryType } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';

import StyleTotal from './cssMyProfile';

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const { userID } = useParams<{ userID: string }>();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useEffect(() => {
    dispatch(
      GET_ALL_POST_BY_USERID_SAGA({
        userId: userID
      })
    );
    dispatch(setIsInProfile(true));
  }, []);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const { isLoading, postArray, userInfo, ownerInfo, isFetching } =
    usePostsData('me');

  useEffect(() => {
    document.title = isLoading ? 'DevHub' : `${userInfo?.lastname} | DevHub`;
  }, [isLoading]);

  const renderRepositoryIem = (item: RepositoryType) => {
    const colorLanguage = GithubColors.get(item.languages)?.color;
    return (
      <a
        className="renderRepositoryIem mb-5"
        style={{
          borderBottom: `1px solid ${themeColorSet.colorBg4}`,
          width: '48%'
        }}
        href={item.url}
        target="_blank">
        <div className="top">
          <span>
            <img
              className="iconRepos inline"
              style={{ color: 'red' }}
              src="/images/Common/repos.svg"
            />
          </span>
          <span
            className="name ml-2"
            style={{
              color: commonColor.colorBlue3,
              fontWeight: 600,
              fontSize: '1.1rem'
            }}>
            {item.name}
          </span>
          <span
            className="rounded-lg ml-3"
            style={{
              color: themeColorSet.colorText3,
              border: `1px solid ${themeColorSet.colorBg4}`,
              fontSize: '0.8rem',
              padding: '0.1rem 0.5rem'
            }}>
            {item.private ? 'Private' : 'Public'}
          </span>
        </div>
        <div
          className="bottom mt-3 flex items-center"
          style={{ color: themeColorSet.colorText2 }}>
          <div className="language mr-4 flex items-center">
            <span
              className="mr-2 pb-2 text-4xl"
              style={{ color: colorLanguage }}>
              •
            </span>
            <span>{item.languages}</span>
          </div>
          <span
            className="star mr-3"
            style={{ color: themeColorSet.colorText3 }}>
            <FontAwesomeIcon size="xs" icon={faStar} />
            <span className="ml-1">{item.stargazersCount}</span>
          </span>
          <span className="fork" style={{ color: themeColorSet.colorText3 }}>
            <FontAwesomeIcon size="xs" icon={faCodeFork} />
            <span className="ml-1">{item.forksCount}</span>
          </span>
        </div>
      </a>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {!postArray || !userInfo || !ownerInfo || isLoading || isFetching ? (
          <LoadingProfileComponent />
        ) : (
          <>
            <Row>
              <Col span={24} className="avatar_cover relative">
                <div
                  className="cover w-full h-80 rounded-br-lg rounded-bl-lg"
                  style={{
                    backgroundImage: `url("${
                      ownerInfo.cover_image || `/images/ProfilePage/cover.jpg`
                    }")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}></div>
                <div className="avatar rounded-full overflow-hidden object-cover flex">
                  <Image
                    src={
                      ownerInfo.user_image ||
                      './images/DefaultAvatar/default_avatar.png'
                    }
                    alt="avt"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </Col>
              <Col offset={3} span={18}>
                <Row className="py-5 name_Editprofile">
                  <Col offset={6} span={12}>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: themeColorSet.colorText1 }}>
                      {ownerInfo.lastname}
                    </div>
                    <div className="position mt-2">
                      <FontAwesomeIcon className="icon" icon={faSnowflake} />
                      <span
                        style={{ color: themeColorSet.colorText3 }}
                        className="ml-2">
                        {ownerInfo.experiences &&
                        ownerInfo.experiences.length > 0
                          ? ownerInfo.experiences.length > 1
                            ? ownerInfo.experiences[0].position_name +
                              ' & ' +
                              ownerInfo.experiences[1].position_name
                            : ownerInfo.experiences[0].position_name
                          : 'No job position'}
                      </span>
                    </div>
                    <div className="viewResume mt-2">
                      <FontAwesomeIcon className="icon" icon={faFileLines} />
                      <NavLink to="/resume" className="ml-2">
                        View Resume
                      </NavLink>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="chat_Follow flex justify-around items-center w-full h-full">
                      <div className="editProfile">
                        <button
                          className="btnEditProfile px-6 py-3 rounded-full"
                          onClick={() => {
                            dispatch(
                              openDrawer({
                                title: 'Edit Profile',
                                component: (
                                  <EditProfileForm key={Math.random()} />
                                )
                              })
                            );
                          }}>
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="id_address_join">
                  <span className="id item mr-2">
                    @{ownerInfo.alias || 'user'}
                  </span>
                  <span className="address item mr-2">
                    <FontAwesomeIcon
                      className="icon mr-2"
                      icon={faLocationDot}
                    />
                    {ownerInfo.location || 'Global'}
                  </span>
                  <span className="join">
                    <FontAwesomeIcon className="icon mr-2" icon={faBriefcase} />
                    Joined {ownerInfo.created_at}
                  </span>
                </div>
                <Col span={18} className="mt-5">
                  <div className="tags flex flex-wrap">
                    {descArray.map((item, index) => {
                      if (ownerInfo.tags.indexOf(item.title) !== -1) {
                        return (
                          <Tag
                            className="item mx-2 my-2 px-4 py-1"
                            key={index}
                            color={themeColorSet.colorBg2}
                            style={{
                              border: 'none'
                            }}>
                            {item.svg} &nbsp;
                            <span style={{ color: themeColorSet.colorText1 }}>
                              {item.title}
                            </span>
                          </Tag>
                        );
                      }
                      return null;
                    })}
                  </div>
                </Col>
                <div className="follow mt-5">
                  <span className="follower item mr-2">
                    <span className="mr-1">{ownerInfo.followers.length}</span>{' '}
                    {ownerInfo.followers.length > 1 ? 'Followers' : 'Follower'}
                  </span>
                  <span className="following item mr-2">
                    <span className="mr-1">{ownerInfo.following.length}</span>{' '}
                    {ownerInfo.following.length > 1
                      ? 'Followings'
                      : 'Following'}
                  </span>
                  <span className="post mr-2">
                    <span className="mr-1">{ownerInfo.posts.length}</span>{' '}
                    {ownerInfo.posts.length > 1 ? 'Posts' : 'Post'}
                  </span>
                </div>
                <div className="experience mt-5">
                  {ownerInfo.experiences.map((item) => (
                    <div className="item mt-2">
                      <FontAwesomeIcon
                        className="icon mr-2"
                        icon={faBriefcase}
                        style={{ color: commonColor.colorBlue1 }}
                      />
                      <span className="company mr-2">{item.company_name}</span>
                      <span className="position mr-2">
                        {item.position_name} |
                      </span>
                      <span className="date">
                        {item.start_date} ~ {item.end_date}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="contact mt-5">
                  <Space>
                    {ownerInfo.contacts.map((item) => {
                      switch (item.key) {
                        case '0':
                          return (
                            <Avatar
                              style={{ color: themeColorSet.colorText1 }}
                              onClick={() => {
                                openInNewTab(item.link);
                              }}
                              className="item"
                              icon={
                                <FontAwesomeIcon icon={icon(faFacebookF)} />
                              }
                            />
                          );
                        case '1':
                          return (
                            <Avatar
                              style={{ color: themeColorSet.colorText1 }}
                              onClick={() => {
                                openInNewTab(item.link);
                              }}
                              className="item"
                              icon={<FontAwesomeIcon icon={icon(faGithub)} />}
                            />
                          );
                        case '2':
                          return (
                            <Avatar
                              style={{ color: themeColorSet.colorText1 }}
                              onClick={() => {
                                openInNewTab(item.link);
                              }}
                              className="item"
                              icon={<FontAwesomeIcon icon={icon(faTwitter)} />}
                            />
                          );
                        case '3':
                          return (
                            <Avatar
                              style={{ color: themeColorSet.colorText1 }}
                              onClick={() => {
                                openInNewTab(item.link);
                              }}
                              className="item"
                              icon={
                                <FontAwesomeIcon icon={icon(faInstagram)} />
                              }
                            />
                          );
                        case '4':
                          return (
                            <Avatar
                              style={{ color: themeColorSet.colorText1 }}
                              onClick={() => {
                                openInNewTab(item.link);
                              }}
                              className="item"
                              icon={<FontAwesomeIcon icon={icon(faLinkedin)} />}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
                  </Space>
                </div>
                <div className="mainContain mt-5">
                  <Tabs
                    defaultActiveKey="2"
                    items={[
                      {
                        key: '1',
                        label: 'Introduction',
                        children: (
                          <div className="mt-10 mb-20">
                            {!ownerInfo.about &&
                              ownerInfo.repositories.length === 0 && (
                                <div className="w-8/12 mb-10">
                                  <Empty
                                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                                    description={<span>No introduction</span>}
                                  />
                                </div>
                              )}
                            {ownerInfo.about && (
                              <div className="w-8/12">
                                <div
                                  style={{
                                    color: themeColorSet.colorText1,
                                    fontWeight: 600,
                                    fontSize: '1.2rem'
                                  }}>
                                  About
                                </div>
                                <ReactQuill
                                  value={ownerInfo.about}
                                  readOnly={true}
                                  theme="bubble"
                                  modules={{}}
                                />
                              </div>
                            )}
                            {ownerInfo.repositories.length !== 0 && (
                              <div className="w-8/12 mt-5">
                                <div
                                  style={{
                                    color: themeColorSet.colorText1,
                                    fontWeight: 600,
                                    fontSize: '1.2rem'
                                  }}>
                                  Repositories
                                </div>
                                <div className="flex flex-wrap justify-between mt-5">
                                  {ownerInfo.repositories.map((item) => {
                                    return renderRepositoryIem(item);
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
                          <div className="mt-5">
                            <div className="w-8/12">
                              <NewPost userInfo={userInfo} />
                            </div>
                            {postArray.length === 0 && (
                              <div className="w-8/12">
                                <Empty
                                  className="mt-10 mb-20"
                                  image={Empty.PRESENTED_IMAGE_DEFAULT}
                                  description={<span>No post</span>}
                                />
                              </div>
                            )}
                            {postArray.map((item) => {
                              return (
                                <div className="w-8/12">
                                  {item.type === 'Share' && (
                                    <MyPostShare
                                      key={item.id}
                                      post={item}
                                      userInfo={ownerInfo}
                                      owner={item.post_attributes.owner_post}
                                    />
                                  )}
                                  {item.type === 'Post' && (
                                    <MyPost
                                      key={item.id}
                                      post={item}
                                      userInfo={ownerInfo}
                                    />
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
      </StyleTotal>
    </ConfigProvider>
  );
};

export default MyProfile;
