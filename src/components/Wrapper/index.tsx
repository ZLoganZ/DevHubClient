import { useEffect, useMemo, lazy, Suspense } from 'react';
import { Col, ConfigProvider, Row, Skeleton } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { GET_COMMUNITY_BY_ID_SAGA } from '@/redux/ActionSaga/CommunityActionSaga';
import OpenOtherPostShareDetail from '@/components/ActionComponent/OpenDetail/OpenOtherPostShareDetail';
import OpenOtherPostDetail from '@/components/ActionComponent/OpenDetail/OpenOtherPostDetail';
import LoadingProfileComponent from '@/components/GlobalSetting/LoadingProfile';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { usePostData, useUserInfo } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';

const CommunityAdmin = lazy(() =>
  import('@/pages/Community').then((module) => ({
    default: module.CommunityAdmin
  }))
);

const CommunityMember = lazy(() =>
  import('@/pages/Community').then((module) => ({
    default: module.CommunityMember
  }))
);

const CommunityNoMember = lazy(() =>
  import('@/pages/Community').then((module) => ({
    default: module.CommunityNoMember
  }))
);

const MyProfile = lazy(() => import('@/pages/MyProfile'));
const Profile = lazy(() => import('@/pages/Profile'));

export const CommunityWrapper = () => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { communityID } = useParams();

  useEffect(() => {
    dispatch(GET_COMMUNITY_BY_ID_SAGA(communityID));
  }, []);

  const { userInfo } = useUserInfo();
  const role = useMemo(() => {
    if (userInfo.role) {
      if (userInfo.role.includes('0101')) return 'ADMIN';
      else if (userInfo.role.includes('0000')) return 'MEMBER';
      else return 'NO_MEMBER';
    }
  }, [userInfo]);
  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <div
        style={{
          backgroundColor: themeColorSet.colorBg1
        }}>
        <Suspense fallback={<LoadingProfileComponent />}>
          {role === 'ADMIN' ? (
            <CommunityAdmin />
          ) : role === 'MEMBER' ? (
            <CommunityMember />
          ) : role === 'NO_MEMBER' ? (
            <CommunityNoMember />
          ) : (
            <LoadingProfileComponent />
          )}
        </Suspense>
      </div>
    </ConfigProvider>
  );
};

export const PostWrapper = () => {
  const { postID } = useParams();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { userInfo, isLoadingUserInfo } = useUserInfo();

  const { post, isLoadingPost } = usePostData(postID!);

  if (isLoadingPost || isLoadingUserInfo || !userInfo || !post) {
    return (
      <ConfigProvider
        theme={{
          token: themeColor
        }}>
        <div
          style={{
            backgroundColor: themeColorSet.colorBg1
          }}>
          <Row className="py-10">
            <Col offset={3} span={18}>
              <Skeleton avatar paragraph={{ rows: 1 }} active />
              <div className="mt-10">
                <Skeleton className="mb-8" active paragraph={{ rows: 3 }} />
                <Skeleton className="mb-8" active paragraph={{ rows: 3 }} />
                <Skeleton className="mb-8" active paragraph={{ rows: 3 }} />
              </div>
              <div className="w-8/12 mt-5">
                <Skeleton
                  className="mb-3"
                  avatar
                  paragraph={{ rows: 1 }}
                  active
                />
                <Skeleton
                  className="mb-3"
                  avatar
                  paragraph={{ rows: 1 }}
                  active
                />
                <Skeleton
                  className="mb-3"
                  avatar
                  paragraph={{ rows: 1 }}
                  active
                />
              </div>
            </Col>
          </Row>
        </div>
      </ConfigProvider>
    );
  } else {
    if (post.type === 'Post')
      return (
        <OpenOtherPostDetail key={post._id} post={post} userInfo={userInfo} />
      );
    else
      return (
        <OpenOtherPostShareDetail
          key={post._id}
          post={post}
          userInfo={userInfo}
        />
      );
  }
};

export const ProfileWrapper = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { userID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { userID: userIDFromStore } = useAppSelector((state) => state.auth);

  const path = location.pathname;

  if (path === '/me' || path === '/user/me')
    navigate(`/user/${userIDFromStore}`);

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <div style={{ backgroundColor: themeColorSet.colorBg1 }}>
        <Suspense fallback={<LoadingProfileComponent />}>
          {!userIDFromStore ? (
            <LoadingProfileComponent />
          ) : userID === 'me' || userID === userIDFromStore ? (
            <MyProfile key={userID} />
          ) : (
            <Profile key={userID} userID={userID!} />
          )}
        </Suspense>
      </div>
    </ConfigProvider>
  );
};
