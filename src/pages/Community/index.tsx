import { useEffect } from 'react';
import StyleTotal from './cssCommunity';
import { format } from 'date-fns';
import { getTheme } from '@/util/theme';
import {
  Avatar,
  Col,
  Collapse,
  ConfigProvider,
  Empty,
  Row,
  Space,
  Tabs
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { commonColor } from '@/util/cssVariable';
import MyPost from '@/components/Post/MyPost';
import NewPost from '@/components/NewPost';
import MyPostShare from '@/components/Post/MyPostShare';
import LoadingProfileComponent from '@/components/GlobalSetting/LoadingProfile';
import { useAppSelector } from '@/hooks/special';
import { useUserInfo } from '@/hooks/fetch';

const { Panel } = Collapse;
const { TabPane } = Tabs;

export const CommunityAdmin = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const community = useAppSelector((state) => state.community.community);

  const { userInfo } = useUserInfo();

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {!community ? (
          <LoadingProfileComponent />
        ) : (
          <div className="communityPage">
            <Row>
              <Col span={24} className="avatar_cover relative">
                <div
                  className="cover w-full h-80 rounded-br-lg rounded-bl-lg"
                  style={{
                    backgroundImage: `url("${
                      community?.coverImage || `/images/ProfilePage/cover.jpg`
                    }")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}></div>
                <div className="avatar rounded-full overflow-hidden object-fill flex">
                  <img
                    src={
                      community?.communityImage ||
                      '/images/DefaultAvatar/default_avatar.png'
                    }
                    alt="avt"
                  />
                </div>
              </Col>
              <Col offset={3} span={18}>
                <Row className="py-5 name_Editprofile">
                  <Col offset={6}>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: themeColorSet.colorText1 }}>
                      {community.name}
                    </div>
                    <div className="description mt-2">
                      <span style={{ color: themeColorSet.colorText2 }}>
                        {community.description}
                      </span>
                    </div>
                    <Space className="subInformation mt-2" size={15}>
                      <div
                        className="unknow"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faFileLines} />
                        <span className="ml-2">Technology</span>
                      </div>
                      <div
                        className="createDate"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          {format(
                            new Date(community.createdAt),
                            'MMM, d, yyyy'
                          )}
                        </span>
                      </div>
                      <div
                        className="members"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          {community.memberLength} Members
                        </span>
                      </div>
                    </Space>
                  </Col>
                </Row>
                <div className="flex">
                  <div className="mainContain mt-5 w-8/12">
                    <Tabs
                      defaultActiveKey="1"
                      // onChange={onChange}
                    >
                      <TabPane tab="All" key="1" className="mt-10">
                        <NewPost userInfo={userInfo} />
                        {community.posts.length === 0 && (
                          <Empty
                            className="mt-10 mb-20"
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                            description={<span>No post</span>}
                          />
                        )}
                        {community.posts.map((item: any, index: any) => {
                          return (
                            <div key={index}>
                              {item.PostShared && (
                                <MyPostShare
                                  key={item._id}
                                  post={item}
                                  userInfo={userInfo}
                                  ownerInfo={item.user}
                                />
                              )}
                              {!item.PostShared && (
                                <MyPost
                                  key={item._id}
                                  post={item}
                                  userInfo={userInfo}
                                />
                              )}
                            </div>
                          );
                        })}
                      </TabPane>
                      <TabPane tab="Code" key="2" className="mt-10">
                        Code
                      </TabPane>
                      <TabPane tab="Link" key="3" className="mt-10">
                        Link
                      </TabPane>
                      <TabPane tab="Poll" key="4" className="mt-10">
                        Poll
                      </TabPane>
                      <TabPane tab="Media" key="5" className="mt-10">
                        Media
                      </TabPane>
                    </Tabs>
                  </div>
                  <div className="infoCommunity mt-32 ml-3 w-4/12">
                    <div
                      className="about px-3 py-4 rounded-md mb-3"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        About
                      </div>
                      <div
                        className="content mb-1"
                        style={{ color: themeColorSet.colorText2 }}>
                        {community.about}
                      </div>
                      <div
                        className="seeMore block mb-3 hover:underline cursor-pointer"
                        style={{
                          transition: 'all .5s',
                          color: commonColor.colorBlue3,
                          fontWeight: 600
                        }}>
                        See More
                      </div>
                      <div
                        className="createDate mb-5"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          Created{' '}
                          {format(
                            new Date(community.createdAt),
                            'MMM, d, yyyy'
                          )}
                        </span>
                      </div>
                      <div
                        className="numberMember text-xl"
                        style={{ fontWeight: 600 }}>
                        {community.memberLength}
                      </div>
                      <div
                        className="titleMembers"
                        style={{ color: themeColorSet.colorText3 }}>
                        Members
                      </div>
                    </div>
                    <div
                      className="tags px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Tags
                      </div>
                      <div className="content flex flex-wrap">
                        {community.tags.map((item: any, index: number) => {
                          return (
                            <span
                              className="tagItem px-4 py-2 mr-2"
                              key={index}>
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="admin px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Admins
                      </div>
                      <div className="content">
                        {community.admins.map((item: any, index: number) => {
                          return (
                            <div
                              className="item flex items-center px-2 py-2"
                              key={index}>
                              <Avatar src={item.userImage} />
                              <Space
                                size={1}
                                direction="vertical"
                                className="ml-2"
                                style={{ color: themeColorSet.colorText2 }}>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: themeColorSet.colorText1
                                  }}>
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: themeColorSet.colorText3 }}>
                                  {item.email.split('@')[0]}
                                </span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="member px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Members
                      </div>
                      <div className="content">
                        {community.members.map((item: any, index: number) => {
                          return (
                            <div
                              className="item flex items-center px-2 py-2"
                              key={index}>
                              <Avatar src={item.userImage} />
                              <Space
                                size={1}
                                direction="vertical"
                                className="ml-2"
                                style={{ color: themeColorSet.colorText2 }}>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: themeColorSet.colorText1
                                  }}>
                                  {' '}
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: themeColorSet.colorText3 }}>
                                  {item.email.split('@')[0]}
                                </span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="rules px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Rules
                      </div>
                      <Collapse>
                        {community.rules.map((item: any, index: number) => {
                          return (
                            <Panel
                              header={index + 1 + '. ' + item.title}
                              key={index}>
                              <p>{item.content}</p>
                            </Panel>
                          );
                        })}
                      </Collapse>
                    </div>
                    <div
                      className="recentlyJoin px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Recently Joined
                      </div>
                      <div className="content">
                        {community.recentlyJoin.map(
                          (item: any, index: number) => {
                            return (
                              <div
                                className="item flex items-center px-2 py-2"
                                key={index}>
                                <Avatar src={item.userImage} />
                                <Space
                                  size={1}
                                  direction="vertical"
                                  className="ml-2"
                                  style={{ color: themeColorSet.colorText2 }}>
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: themeColorSet.colorText1
                                    }}>
                                    {' '}
                                    {item.name}
                                  </span>
                                  <span
                                    style={{ color: themeColorSet.colorText3 }}>
                                    {item.email.split('@')[0]}
                                  </span>
                                </Space>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </StyleTotal>
    </ConfigProvider>
  );
};

export const CommunityMember = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const community = useSelector((state: any) => state.community.community);

  const userInfo = useSelector(
    (state: RootState) => state.userReducer.userInfo
  );

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {!community ? (
          <LoadingProfileComponent />
        ) : (
          <div className="communityPage">
            <Row>
              <Col span={24} className="avatar_cover relative">
                <div
                  className="cover w-full h-80 rounded-br-lg rounded-bl-lg"
                  style={{
                    backgroundImage: `url("${
                      community?.coverImage || `/images/ProfilePage/cover.jpg`
                    }")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}></div>
                <div className="avatar rounded-full overflow-hidden object-fill flex">
                  <img
                    src={
                      community?.communityImage ||
                      '/images/DefaultAvatar/default_avatar.png'
                    }
                    alt="avt"
                  />
                </div>
              </Col>
              <Col offset={3} span={18}>
                <Row className="py-5 name_Editprofile">
                  <Col offset={6}>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: themeColorSet.colorText1 }}>
                      {community.name}
                    </div>
                    <div className="description mt-2">
                      <span style={{ color: themeColorSet.colorText2 }}>
                        {community.description}
                      </span>
                    </div>
                    <Space className="subInformation mt-2" size={15}>
                      <div
                        className="unknow"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faFileLines} />
                        <span className="ml-2">Technology</span>
                      </div>
                      <div
                        className="createDate"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          {format(
                            new Date(community.createdAt),
                            'MMM, d, yyyy'
                          )}
                        </span>
                      </div>
                      <div
                        className="members"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          {community.memberLength} Members
                        </span>
                      </div>
                    </Space>
                  </Col>
                </Row>
                <div className="flex">
                  <div className="mainContain mt-5 w-8/12">
                    <Tabs
                      defaultActiveKey="1"
                      // onChange={onChange}
                    >
                      <TabPane tab="All" key="1" className="mt-10">
                        <NewPost userInfo={userInfo} />
                        {community.posts.length === 0 && (
                          <Empty
                            className="mt-10 mb-20"
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                            description={<span>No post</span>}
                          />
                        )}
                        {community.posts.map((item: any, index: any) => {
                          return (
                            <div key={index}>
                              {item.PostShared && (
                                <MyPostShare
                                  key={item._id}
                                  post={item}
                                  userInfo={userInfo}
                                  ownerInfo={item.user}
                                />
                              )}
                              {!item.PostShared && (
                                <MyPost
                                  key={item._id}
                                  post={item}
                                  userInfo={userInfo}
                                />
                              )}
                            </div>
                          );
                        })}
                      </TabPane>
                      <TabPane tab="Code" key="2" className="mt-10">
                        Code
                      </TabPane>
                      <TabPane tab="Link" key="3" className="mt-10">
                        Link
                      </TabPane>
                      <TabPane tab="Poll" key="4" className="mt-10">
                        Poll
                      </TabPane>
                      <TabPane tab="Media" key="5" className="mt-10">
                        Media
                      </TabPane>
                    </Tabs>
                  </div>
                  <div className="infoCommunity mt-32 ml-3 w-4/12">
                    <div
                      className="about px-3 py-4 rounded-md mb-3"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        About
                      </div>
                      <div
                        className="content mb-1"
                        style={{ color: themeColorSet.colorText2 }}>
                        {community.about}
                      </div>
                      <div
                        className="seeMore block mb-3 hover:underline cursor-pointer"
                        style={{
                          transition: 'all .5s',
                          color: commonColor.colorBlue3,
                          fontWeight: 600
                        }}>
                        See More
                      </div>
                      <div
                        className="createDate mb-5"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          Created{' '}
                          {format(
                            new Date(community.createdAt),
                            'MMM, d, yyyy'
                          )}
                        </span>
                      </div>
                      <div
                        className="numberMember text-xl"
                        style={{ fontWeight: 600 }}>
                        {community.memberLength}
                      </div>
                      <div
                        className="titleMembers"
                        style={{ color: themeColorSet.colorText3 }}>
                        Members
                      </div>
                    </div>
                    <div
                      className="tags px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Tags
                      </div>
                      <div className="content flex flex-wrap">
                        {community.tags.map((item: any, index: number) => {
                          return (
                            <span
                              className="tagItem px-4 py-2 mr-2"
                              key={index}>
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="admin px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Admins
                      </div>
                      <div className="content">
                        {community.admins.map((item: any, index: number) => {
                          return (
                            <div
                              className="item flex items-center px-2 py-2"
                              key={index}>
                              <Avatar src={item.userImage} />
                              <Space
                                size={1}
                                direction="vertical"
                                className="ml-2"
                                style={{ color: themeColorSet.colorText2 }}>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: themeColorSet.colorText1
                                  }}>
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: themeColorSet.colorText3 }}>
                                  {item.email.split('@')[0]}
                                </span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="member px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Members
                      </div>
                      <div className="content">
                        {community.members.map((item: any, index: number) => {
                          return (
                            <div
                              className="item flex items-center px-2 py-2"
                              key={index}>
                              <Avatar src={item.userImage} />
                              <Space
                                size={1}
                                direction="vertical"
                                className="ml-2"
                                style={{ color: themeColorSet.colorText2 }}>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: themeColorSet.colorText1
                                  }}>
                                  {' '}
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: themeColorSet.colorText3 }}>
                                  {item.email.split('@')[0]}
                                </span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="rules px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Rules
                      </div>
                      <Collapse>
                        {community.rules.map((item: any, index: number) => {
                          return (
                            <Panel
                              header={index + 1 + '. ' + item.title}
                              key={index}>
                              <p>{item.content}</p>
                            </Panel>
                          );
                        })}
                      </Collapse>
                    </div>
                    <div
                      className="recentlyJoin px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Recently Joined
                      </div>
                      <div className="content">
                        {community.recentlyJoin.map(
                          (item: any, index: number) => {
                            return (
                              <div
                                className="item flex items-center px-2 py-2"
                                key={index}>
                                <Avatar src={item.userImage} />
                                <Space
                                  size={1}
                                  direction="vertical"
                                  className="ml-2"
                                  style={{ color: themeColorSet.colorText2 }}>
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: themeColorSet.colorText1
                                    }}>
                                    {' '}
                                    {item.name}
                                  </span>
                                  <span
                                    style={{ color: themeColorSet.colorText3 }}>
                                    {item.email.split('@')[0]}
                                  </span>
                                </Space>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </StyleTotal>
    </ConfigProvider>
  );
};

export const CommunityNoMember = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const community = useSelector((state: any) => state.community.community);

  const userInfo = useSelector(
    (state: RootState) => state.userReducer.userInfo
  );

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {!community ? (
          <LoadingProfileComponent />
        ) : (
          <div className="communityPage">
            <Row>
              <Col span={24} className="avatar_cover relative">
                <div
                  className="cover w-full h-80 rounded-br-lg rounded-bl-lg"
                  style={{
                    backgroundImage: `url("${
                      community?.coverImage || `/images/ProfilePage/cover.jpg`
                    }")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}></div>
                <div className="avatar rounded-full overflow-hidden object-fill flex">
                  <img
                    src={
                      community?.communityImage ||
                      '/images/DefaultAvatar/default_avatar.png'
                    }
                    alt="avt"
                  />
                </div>
              </Col>
              <Col offset={3} span={18}>
                <Row className="py-5 name_Editprofile">
                  <Col offset={6}>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: themeColorSet.colorText1 }}>
                      {community.name}
                    </div>
                    <div className="description mt-2">
                      <span style={{ color: themeColorSet.colorText2 }}>
                        {community.description}
                      </span>
                    </div>
                    <Space className="subInformation mt-2" size={15}>
                      <div
                        className="unknow"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faFileLines} />
                        <span className="ml-2">Technology</span>
                      </div>
                      <div
                        className="createDate"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          {format(
                            new Date(community.createdAt),
                            'MMM, d, yyyy'
                          )}
                        </span>
                      </div>
                      <div
                        className="members"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          {community.memberLength} Members
                        </span>
                      </div>
                    </Space>
                  </Col>
                </Row>
                <div className="flex">
                  <div className="mainContain mt-5 w-8/12">
                    <Tabs
                      defaultActiveKey="1"
                      // onChange={onChange}
                    >
                      <TabPane tab="All" key="1" className="mt-10">
                        <NewPost userInfo={userInfo} />
                        {community.posts.length === 0 && (
                          <Empty
                            className="mt-10 mb-20"
                            image={Empty.PRESENTED_IMAGE_DEFAULT}
                            description={<span>No post</span>}
                          />
                        )}
                        {community.posts.map((item: any, index: any) => {
                          return (
                            <div key={index}>
                              {item.PostShared && (
                                <MyPostShare
                                  key={item._id}
                                  post={item}
                                  userInfo={userInfo}
                                  ownerInfo={item.user}
                                />
                              )}
                              {!item.PostShared && (
                                <MyPost
                                  key={item._id}
                                  post={item}
                                  userInfo={userInfo}
                                />
                              )}
                            </div>
                          );
                        })}
                      </TabPane>
                      <TabPane tab="Code" key="2" className="mt-10">
                        Code
                      </TabPane>
                      <TabPane tab="Link" key="3" className="mt-10">
                        Link
                      </TabPane>
                      <TabPane tab="Poll" key="4" className="mt-10">
                        Poll
                      </TabPane>
                      <TabPane tab="Media" key="5" className="mt-10">
                        Media
                      </TabPane>
                    </Tabs>
                  </div>
                  <div className="infoCommunity mt-32 ml-3 w-4/12">
                    <div
                      className="about px-3 py-4 rounded-md mb-3"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        About
                      </div>
                      <div
                        className="content mb-1"
                        style={{ color: themeColorSet.colorText2 }}>
                        {community.about}
                      </div>
                      <div
                        className="seeMore block mb-3 hover:underline cursor-pointer"
                        style={{
                          transition: 'all .5s',
                          color: commonColor.colorBlue3,
                          fontWeight: 600
                        }}>
                        See More
                      </div>
                      <div
                        className="createDate mb-5"
                        style={{ color: themeColorSet.colorText3 }}>
                        <FontAwesomeIcon className="icon" icon={faCalendar} />
                        <span className="ml-2">
                          Created{' '}
                          {format(
                            new Date(community.createdAt),
                            'MMM, d, yyyy'
                          )}
                        </span>
                      </div>
                      <div
                        className="numberMember text-xl"
                        style={{ fontWeight: 600 }}>
                        {community.memberLength}
                      </div>
                      <div
                        className="titleMembers"
                        style={{ color: themeColorSet.colorText3 }}>
                        Members
                      </div>
                    </div>
                    <div
                      className="tags px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Tags
                      </div>
                      <div className="content flex flex-wrap">
                        {community.tags.map((item: any, index: number) => {
                          return (
                            <span
                              className="tagItem px-4 py-2 mr-2"
                              key={index}>
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="admin px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Admins
                      </div>
                      <div className="content">
                        {community.admins.map((item: any, index: number) => {
                          return (
                            <div
                              className="item flex items-center px-2 py-2"
                              key={index}>
                              <Avatar src={item.userImage} />
                              <Space
                                size={1}
                                direction="vertical"
                                className="ml-2"
                                style={{ color: themeColorSet.colorText2 }}>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: themeColorSet.colorText1
                                  }}>
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: themeColorSet.colorText3 }}>
                                  {item.email.split('@')[0]}
                                </span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="member px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Members
                      </div>
                      <div className="content">
                        {community.members.map((item: any, index: number) => {
                          return (
                            <div
                              className="item flex items-center px-2 py-2"
                              key={index}>
                              <Avatar src={item.userImage} />
                              <Space
                                size={1}
                                direction="vertical"
                                className="ml-2"
                                style={{ color: themeColorSet.colorText2 }}>
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: themeColorSet.colorText1
                                  }}>
                                  {' '}
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: themeColorSet.colorText3 }}>
                                  {item.email.split('@')[0]}
                                </span>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="rules px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Rules
                      </div>
                      <Collapse>
                        {community.rules.map((item: any, index: number) => {
                          return (
                            <Panel
                              header={index + 1 + '. ' + item.title}
                              key={index}>
                              <p>{item.content}</p>
                            </Panel>
                          );
                        })}
                      </Collapse>
                    </div>
                    <div
                      className="recentlyJoin px-3 py-4 mb-3 rounded-md"
                      style={{ backgroundColor: themeColorSet.colorBg2 }}>
                      <div
                        className="title mb-2 text-lg"
                        style={{ fontWeight: 600 }}>
                        Recently Joined
                      </div>
                      <div className="content">
                        {community.recentlyJoin.map(
                          (item: any, index: number) => {
                            return (
                              <div
                                className="item flex items-center px-2 py-2"
                                key={index}>
                                <Avatar src={item.userImage} />
                                <Space
                                  size={1}
                                  direction="vertical"
                                  className="ml-2"
                                  style={{ color: themeColorSet.colorText2 }}>
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: themeColorSet.colorText1
                                    }}>
                                    {' '}
                                    {item.name}
                                  </span>
                                  <span
                                    style={{ color: themeColorSet.colorText3 }}>
                                    {item.email.split('@')[0]}
                                  </span>
                                </Space>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </StyleTotal>
    </ConfigProvider>
  );
};
