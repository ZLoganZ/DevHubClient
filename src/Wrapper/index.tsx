import { useEffect, useMemo, lazy, Suspense } from 'react';
import { Col, Row, Skeleton } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { GET_COMMUNITY_BY_ID_SAGA } from '@/redux/ActionSaga/CommunityActionSaga';
import LoadingProfileComponent from '@/components/Loading/LoadingProfile';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { usePostData, useCurrentUserInfo } from '@/hooks/fetch';
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

const MyPostDetail = lazy(() => import('@/components/PostDetail/MyPostDetail'));
const OtherPostDetail = lazy(() => import('@/components/PostDetail/OtherPostDetail'));

export const CommunityWrapper = () => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { communityID } = useParams();

  useEffect(() => {
    dispatch(GET_COMMUNITY_BY_ID_SAGA(communityID));
  }, []);

  const { currentUserInfo } = useCurrentUserInfo();
  const role = useMemo(() => {
    if (currentUserInfo.role) {
      if (currentUserInfo.role.includes('0101')) return 'ADMIN';
      if (currentUserInfo.role.includes('0000')) return 'MEMBER';
      return 'NO_MEMBER';
    }
  }, [currentUserInfo]);
  return (
    <div style={{ backgroundColor: themeColorSet.colorBg1 }}>
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
  );
};

export const PostWrapper = () => {
  const { postID } = useParams();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();

  const { post, isLoadingPost } = usePostData(postID!);

  const LoadingPost = () => (
    <div style={{ backgroundColor: themeColorSet.colorBg1, minHeight: 'calc(100vh - 5rem)' }}>
      <Row className='py-10'>
        <Col offset={3} span={18}>
          <Skeleton avatar paragraph={{ rows: 1 }} active />
          <div className='mt-10'>
            <Skeleton className='mb-8' active paragraph={{ rows: 2 }} />
            <Skeleton className='mb-8' active paragraph={{ rows: 2 }} />
            <Skeleton className='mb-8' active paragraph={{ rows: 2 }} />
          </div>
          <div className='w-8/12 mt-5'>
            <Skeleton className='mb-3' avatar paragraph={{ rows: 1 }} active />
            <Skeleton className='mb-3' avatar paragraph={{ rows: 1 }} active />
            <Skeleton className='mb-3' avatar paragraph={{ rows: 1 }} active />
          </div>
        </Col>
      </Row>
    </div>
  );

  return (
    <Suspense fallback={<LoadingPost />}>
      {isLoadingPost || !currentUserInfo || !post ? (
        <LoadingPost />
      ) : (
        <div
          className='py-4 px-80'
          style={{
            backgroundColor: themeColorSet.colorBg1,
            minHeight: 'calc(100vh - 5rem)'
          }}>
          {post.post_attributes.user._id === currentUserInfo._id ? (
            <MyPostDetail key={post._id} post={post} postAuthor={currentUserInfo} isDetail />
          ) : (
            <OtherPostDetail
              key={post._id}
              post={post}
              postAuthor={post.post_attributes.user}
              currentUser={currentUserInfo}
              isDetail
            />
          )}
        </div>
      )}
    </Suspense>
  );
};

export const ProfileWrapper = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { userID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const userIDFromStore = useAppSelector((state) => state.auth.userID);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/me' || path === '/user/me') navigate(`/user/${userIDFromStore}`);
  }, [userIDFromStore, location.pathname]);

  return (
    <div style={{ backgroundColor: themeColorSet.colorBg1 }}>
      <Suspense fallback={<LoadingProfileComponent />}>
        {userID &&
          (userID === userIDFromStore ? (
            <MyProfile key={userID} />
          ) : (
            <Profile key={userID} userID={userID} />
          ))}
      </Suspense>
    </div>
  );
};
