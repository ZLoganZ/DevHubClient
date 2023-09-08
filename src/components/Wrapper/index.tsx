import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { Col, ConfigProvider, Row, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { GET_COMMUNITY_BY_ID_SAGA } from "@/redux/ActionSaga/CommunityActionSaga";
import { GET_USER_ID } from "@/redux/ActionSaga/AuthActionSaga";
import {
  GET_POSTSHARE_BY_ID_SAGA,
  GET_POST_BY_ID_SAGA,
} from "@/redux/ActionSaga/PostActionSaga";
import OpenOtherPostShareDetail from "@/components/ActionComponent/OpenDetail/OpenOtherPostShareDetail";
import OpenOtherPostDetail from "@/components/ActionComponent/OpenDetail/OpenOtherPostDetail";
import LoadingProfileComponent from "@/components/GlobalSetting/LoadingProfile";
import { getTheme } from "@/util/functions/ThemeFunction";

const CommunityAdmin = lazy(() =>
  import("@/pages/Community").then((module) => ({
    default: module.CommunityAdmin,
  }))
);

const CommunityMember = lazy(() =>
  import("@/pages/Community").then((module) => ({
    default: module.CommunityMember,
  }))
);

const CommunityNoMember = lazy(() =>
  import("@/pages/Community").then((module) => ({
    default: module.CommunityNoMember,
  }))
);

const MyProfile = lazy(() => import("@/pages/MyProfile"));
const Profile = lazy(() => import("@/pages/Profile"));

export const CommunityWrapper = () => {
  const dispatch = useDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { communityID } = useParams();

  useEffect(() => {
    dispatch(GET_COMMUNITY_BY_ID_SAGA(communityID));
  }, []);

  const userInfo = useSelector((state: any) => state.userReducer.userInfo);
  const role = useMemo(() => {
    if (userInfo.role) {
      if (userInfo.role === "ADMIN") return "ADMIN";
      else if (userInfo.role === "MEMBER") return "MEMBER";
      else return "NO_MEMBER";
    }
  }, [userInfo]);
  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <div
        style={{
          backgroundColor: themeColorSet.colorBg1,
        }}>
        <Suspense fallback={<LoadingProfileComponent />}>
          {role === "ADMIN" ? (
            <CommunityAdmin />
          ) : role === "MEMBER" ? (
            <CommunityMember />
          ) : role === "NO_MEMBER" ? (
            <CommunityNoMember />
          ) : (
            <LoadingProfileComponent />
          )}
        </Suspense>
      </div>
    </ConfigProvider>
  );
};

export const PostShareWrapper = () => {
  const { postID } = useParams();
  const dispatch = useDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const postSlice = useSelector((state: any) => state.postReducer.post);
  const userInfoSlice = useSelector((state: any) => state.userReducer.userInfo);

  const post = useMemo(() => postSlice, [postSlice]);
  const userInfo = useMemo(() => userInfoSlice, [userInfoSlice]);

  const [isNotAlreadyChanged, setIsNotAlreadyChanged] = useState(true);

  const postRef = useRef(post);

  useEffect(() => {
    dispatch(
      GET_POSTSHARE_BY_ID_SAGA({
        id: postID,
      })
    );
  }, []);

  useEffect(() => {
    if (!isNotAlreadyChanged) return;

    setIsNotAlreadyChanged(postRef.current === post);
  }, [post, isNotAlreadyChanged]);

  useEffect(() => {
    if (!isNotAlreadyChanged) {
      postRef.current = post;
    }
  }, [isNotAlreadyChanged, post]);

  if (!post || !userInfo || isNotAlreadyChanged) {
    return (
      <ConfigProvider
        theme={{
          token: themeColor,
        }}>
        <div
          style={{
            backgroundColor: themeColorSet.colorBg1,
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
    return (
      <OpenOtherPostShareDetail
        key={post._id}
        post={post}
        userInfo={userInfo}
      />
    );
  }
};

export const PostWrapper = () => {
  const { postID } = useParams();
  const dispatch = useDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const postSlice = useSelector((state: any) => state.postReducer.post);
  const userInfoSlice = useSelector((state: any) => state.userReducer.userInfo);

  const post = useMemo(() => postSlice, [postSlice]);
  const userInfo = useMemo(() => userInfoSlice, [userInfoSlice]);

  const [isNotAlreadyChanged, setIsNotAlreadyChanged] = useState(true);

  const postRef = useRef(post);

  useEffect(() => {
    dispatch(
      GET_POST_BY_ID_SAGA({
        id: postID,
      })
    );
  }, []);

  useEffect(() => {
    if (!isNotAlreadyChanged) return;

    setIsNotAlreadyChanged(postRef.current === post);
  }, [post, isNotAlreadyChanged]);

  useEffect(() => {
    if (!isNotAlreadyChanged) {
      postRef.current = post;
    }
  }, [isNotAlreadyChanged, post]);

  if (!post || !userInfo || isNotAlreadyChanged) {
    return (
      <ConfigProvider
        theme={{
          token: themeColor,
        }}>
        <div
          style={{
            backgroundColor: themeColorSet.colorBg1,
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
    return (
      <OpenOtherPostDetail key={post._id} post={post} userInfo={userInfo} />
    );
  }
};

export const ProfileWrapper = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { userID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userID: userIDFromStore } = useSelector(
    (state: any) => state.authReducer
  );

  useEffect(() => {
    dispatch(GET_USER_ID());
  }, []);

  const path = location.pathname;

  if (path === "/me") navigate(`/user/${userIDFromStore}`);

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <div style={{ backgroundColor: themeColorSet.colorBg1 }}>
        <Suspense fallback={<LoadingProfileComponent />}>
          {!userIDFromStore ? (
            <LoadingProfileComponent />
          ) : userID === "me" || userID === userIDFromStore ? (
            <MyProfile key={userID} />
          ) : (
            <Profile key={userID} userID={userID} />
          )}
        </Suspense>
      </div>
    </ConfigProvider>
  );
};
