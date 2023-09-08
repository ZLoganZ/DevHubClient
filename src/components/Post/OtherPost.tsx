import {
  faBookmark,
  faComment,
  faUpRightFromSquare,
  faEllipsis,
  faHeart,
  faShare,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  ConfigProvider,
  Divider,
  Dropdown,
  Image,
  Popover,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, isThisWeek, isThisYear, isToday } from "date-fns";
import { NavLink } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

import {
  LIKE_POST_SAGA,
  SHARE_POST_SAGA,
  SAVE_POST_SAGA,
  INCREASE_VIEW_SAGA,
} from "@/redux/ActionSaga/PostActionSaga";
import { GET_USER_ID } from "@/redux/ActionSaga/AuthActionSaga";
import OpenOtherPostDetailModal from "@/components/ActionComponent/OpenDetail/OpenOtherPostDetailModal";
import PopupInfoUser from "@/components/PopupInfoUser";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { getTheme } from "@/util/functions/ThemeFunction";
import StyleTotal from "./cssPost";

interface PostProps {
  post: any;
  userInfo: any;
  detail?: boolean;
}

// -----------------------------------------------------

const OtherPost = (PostProps: PostProps) => {
  const link = PostProps.post.link;
  const dispatch = useDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // ------------------------ Like ------------------------

  // Like Number
  const [likeNumber, setLikeNumber] = useState(PostProps.post?.likes?.length);
  useEffect(() => {
    setLikeNumber(PostProps.post?.likes?.length);
  }, [PostProps.post?.likes?.length]);

  // Like color
  const [likeColor, setLikeColor] = useState(themeColorSet.colorText1);
  useEffect(() => {
    PostProps.post?.isLiked
      ? setLikeColor("red")
      : setLikeColor(themeColorSet.colorText1);
  }, [PostProps.post?.isLiked, change]);

  // isLiked
  const [isLiked, setIsLiked] = useState(true);
  useEffect(() => {
    setIsLiked(PostProps.post?.isLiked);
  }, [PostProps.post?.isLiked]);

  // ------------------------ Share ------------------------

  // Share Number
  const [shareNumber, setShareNumber] = useState(
    PostProps.post?.shares?.length
  );
  useEffect(() => {
    setShareNumber(PostProps.post?.shares?.length);
  }, [PostProps.post?.shares?.length]);

  // Share color
  const [shareColor, setShareColor] = useState(themeColorSet.colorText1);
  useEffect(() => {
    PostProps.post?.isShared
      ? setShareColor("blue")
      : setShareColor(themeColorSet.colorText1);
  }, [PostProps.post?.isShared, change]);

  // isShared
  const [isShared, setIsShared] = useState(true);
  useEffect(() => {
    setIsShared(PostProps.post?.isShared);
  }, [PostProps.post?.isShared]);

  // ------------------------ Save ------------------------

  // isSaved
  const [isSaved, setIsSaved] = useState(true);
  useEffect(() => {
    setIsSaved(PostProps.post?.isSaved);
  }, [PostProps.post?.isSaved]);

  // Save color
  const [saveColor, setSaveColor] = useState(themeColorSet.colorText1);
  useEffect(() => {
    PostProps.post?.isSaved
      ? setSaveColor("yellow")
      : setSaveColor(themeColorSet.colorText1);
  }, [PostProps.post?.isSaved, change]);

  const formatDateTime = (date: any) => {
    if (isToday(date)) {
      return format(date, "p"); // Display only time for today
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, "iiii, p"); // Display full day of the week and time for this week
    } else if (isThisYear(date)) {
      return format(date, "eeee, MMMM d • p"); // Display full day of the week, date, and time for this year
    } else {
      return format(date, "eeee, MMMM d, yyyy • p"); // Display full day of the week, date, year, and time for other cases
    }
  };

  const createdAt = new Date(PostProps.post?.createdAt);
  //format date to get full date
  const date = formatDateTime(createdAt);

  // post setting
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="item flex items-center px-4 py-2">
          <FontAwesomeIcon className="icon" icon={faUpRightFromSquare} />
          <span className="ml-2">Open post in new tab</span>
        </div>
      ),
      onClick: () => {
        window.open(`/post/${PostProps.post?._id}`, "_blank")?.focus();
      },
    },
  ];

  // Open OtherPostDetailModal
  const [isOpenPostDetail, setIsOpenPostDetail] = useState(false);

  // Read more, read less

  function removeCode(htmlString: any): any {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    const elements = doc.getElementsByClassName("ql-syntax");
    while (elements.length > 0) elements[0].remove();
    return doc.body.innerHTML;
  }

  const [expanded, setExpanded] = useState(false);

  const displayContent =
    expanded || PostProps.post?.content?.length <= 250
      ? PostProps.post?.content
      : removeCode(PostProps.post?.content)?.slice(0, 250) + "...";

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // ------------------------ View ------------------------
  const postRef = React.useRef(null);

  const onIntersect = () => {
    dispatch(
      INCREASE_VIEW_SAGA({
        id: PostProps.post?._id,
      })
    );
  };

  useIntersectionObserver(postRef, onIntersect);

  // Get my userID
  useEffect(() => {
    dispatch(GET_USER_ID());
  }, []);

  const { userID } = useSelector((state: any) => state.authReducer);

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      {isOpenPostDetail && (
        <OpenOtherPostDetailModal
          key={PostProps.post?._id}
          post={PostProps.post}
          userInfo={PostProps.userInfo}
          visible={isOpenPostDetail}
          setVisible={setIsOpenPostDetail}
        />
      )}
      <StyleTotal theme={themeColorSet} className={"rounded-lg mb-4"}>
        <div ref={postRef} className="post px-4 py-3">
          <div className="postHeader flex justify-between items-center">
            <div className="postHeader__left">
              <div className="name_avatar flex">
                <Avatar size={50} src={PostProps.userInfo?.userImage} />
                <div className="name ml-2">
                  <Popover
                    overlayInnerStyle={{
                      border: `1px solid ${themeColorSet.colorBg3}`,
                    }}
                    mouseEnterDelay={0.7}
                    content={
                      <PopupInfoUser
                        userInfo={PostProps.userInfo}
                        isMe={userID}
                      />
                    }>
                    <div className="name__top font-bold">
                      <NavLink
                        to={`/user/${PostProps.userInfo?.id}`}
                        style={{ color: themeColorSet.colorText1 }}>
                        {PostProps.userInfo?.username}
                      </NavLink>
                    </div>
                  </Popover>
                  <div
                    className="time"
                    style={{ color: themeColorSet.colorText3 }}>
                    <NavLink
                      to={`/post/${PostProps.post?._id}`}
                      style={{ color: themeColorSet.colorText3 }}>
                      <span>{date}</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="postHeader__right">
              <div className="icon">
                <Dropdown
                  menu={{ items }}
                  placement="bottomRight"
                  trigger={["click"]}>
                  <FontAwesomeIcon size="lg" icon={faEllipsis} />
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="postBody mt-5">
            <div className="title font-bold">{PostProps.post?.title}</div>
            <div className="content mt-3">
              {/* <div
                className="content__text"
                dangerouslySetInnerHTML={{
                  __html: displayContent,
                }}
              ></div> */}
              <div className="content__text">
                <ReactQuill
                  value={displayContent}
                  readOnly={true}
                  theme={"bubble"}
                  modules={{}}
                />
                {PostProps.post?.content?.length > 250 && (
                  <a onClick={toggleExpanded}>
                    {expanded ? "Read less" : "Read more"}
                  </a>
                )}
              </div>
              {PostProps.post.url ? (
                <div className="contentImage mt-3">
                  <Image
                    src={PostProps.post.url}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
              ) : link ? (
                <a
                  href={link.linkAddress}
                  target="_blank"
                  style={{
                    color: themeColorSet.colorText2,
                  }}>
                  <div
                    className="contentLink flex mt-5 px-3 py-3 cursor-pointer"
                    style={{ backgroundColor: themeColorSet.colorBg4 }}>
                    <div className="left w-4/5 p-2">
                      <div
                        className="mb-2"
                        style={{
                          fontWeight: 600,
                          color: themeColorSet.colorText1,
                        }}>
                        {link.title?.length > 100
                          ? link.title.slice(0, 100) + "..."
                          : link.title}
                      </div>
                      <div>
                        {link.description?.length > 100
                          ? link.description.slice(0, 100) + "..."
                          : link.description}
                      </div>
                    </div>
                    <img
                      src={link.image}
                      alt=""
                      className="w-1/5"
                      style={{
                        maxWidth: "120px",
                      }}
                    />
                  </div>
                </a>
              ) : (
                <></>
              )}
            </div>
            <Divider style={{ backgroundColor: themeColorSet.colorText1 }} />
          </div>
          <div className="postFooter flex justify-between items-center">
            <div className="like_share flex justify-between w-1/5">
              <Space className="like" direction="vertical" align="center">
                <span>
                  {likeNumber}
                  {likeNumber > 1 ? " Likes" : " Like"}
                </span>
                <Avatar
                  className="item"
                  style={{ backgroundColor: "transparent" }}
                  icon={<FontAwesomeIcon icon={faHeart} color={likeColor} />}
                  onClick={(e: any) => {
                    if (isLiked) {
                      setLikeNumber(likeNumber - 1);
                      setLikeColor(themeColorSet.colorText1);
                      setIsLiked(false);
                    } else {
                      setLikeNumber(likeNumber + 1);
                      setLikeColor("red");
                      setIsLiked(true);
                    }
                    dispatch(
                      LIKE_POST_SAGA({
                        id: PostProps.post?._id,
                      })
                    );
                  }}
                />
              </Space>
              <Space className="like" direction="vertical" align="center">
                <span>
                  {shareNumber}
                  {shareNumber > 1 ? " Shares" : " Share"}
                </span>
                <Avatar
                  className="item"
                  style={{ backgroundColor: "transparent" }}
                  icon={<FontAwesomeIcon icon={faShare} color={shareColor} />}
                  onClick={(e: any) => {
                    if (isShared) {
                      setShareNumber(shareNumber - 1);
                      setShareColor(themeColorSet.colorText1);
                      setIsShared(false);
                    } else {
                      setShareNumber(shareNumber + 1);
                      setShareColor("blue");
                      setIsShared(true);
                    }
                    dispatch(
                      SHARE_POST_SAGA({
                        id: PostProps.post?._id,
                      })
                    );
                  }}
                />
              </Space>
            </div>
            <div className="comment_view flex justify-between w-1/3">
              <Space className="like" direction="vertical" align="center">
                <span>
                  {PostProps.post?.comments?.length}
                  {PostProps.post?.comments?.length > 1
                    ? " Comments"
                    : " Comment"}
                </span>
                <Avatar
                  className={`${PostProps.detail ? "cursor-default" : "item"}`}
                  style={{ backgroundColor: "transparent" }}
                  icon={
                    <FontAwesomeIcon
                      icon={faComment}
                      color={themeColorSet.colorText1}
                    />
                  }
                  onClick={() => {
                    if (!PostProps.detail) {
                      setIsOpenPostDetail(true);
                    }
                  }}
                />
              </Space>
              <Space className="like" direction="vertical" align="center">
                <span>
                  {PostProps.post.views}{" "}
                  {PostProps.post.views > 1 ? "Views" : "View"}
                </span>
                <Space>
                  <Avatar
                    className="item"
                    style={{ backgroundColor: "transparent" }}
                    icon={
                      <FontAwesomeIcon icon={faBookmark} color={saveColor} />
                    }
                    onClick={(e: any) => {
                      if (isSaved) {
                        setIsSaved(false);
                        setSaveColor(themeColorSet.colorText1);
                      } else {
                        setIsSaved(true);
                        setSaveColor("yellow");
                      }
                      dispatch(
                        SAVE_POST_SAGA({
                          id: PostProps.post?._id,
                        })
                      );
                    }}
                  />
                  <Avatar
                    className="item"
                    style={{ backgroundColor: "transparent" }}
                    icon={<FontAwesomeIcon icon={faShareNodes} />}
                  />
                </Space>
              </Space>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default OtherPost;
