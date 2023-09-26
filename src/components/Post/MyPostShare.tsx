import {
  faComment,
  faUpRightFromSquare,
  faEllipsis,
  faHeart,
  faShareNodes,
  faTrash,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Dropdown,
  Space,
  Modal,
  notification,
  Popover,
  Image
} from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

import OpenMyPostDetailModal from '@/components/ActionComponent/OpenDetail/OpenMyPostDetailModal';
import PopupInfoUser from '@/components/PopupInfoUser';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { commonColor } from '@/util/cssVariable';
import { useAppSelector, useIntersectionObserver } from '@/hooks/special';
import { useDeletePost, useLikePost, useViewPost } from '@/hooks/mutation';
import { PostType, UserInfoType } from '@/types';
import StyleTotal from './cssPost';

interface PostShareProps {
  postShared: PostType;
  userInfo: UserInfoType;
  ownerInfo: UserInfoType;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const MyPostShare = (PostProps: PostShareProps) => {
  const link = PostProps.postShared.post_attributes.url;

  // Lấy theme từ LocalStorage chuyển qua css
  const change = useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateLikePost } = useLikePost();
  const { mutateDeletePost } = useDeletePost();
  const { mutateViewPost } = useViewPost();

  // ------------------------ Like ------------------------

  // Like Number
  const [likeNumber, setLikeNumber] = useState(
    PostProps.postShared.post_attributes.like_number
  );
  useEffect(() => {
    setLikeNumber(PostProps.postShared.post_attributes.like_number);
  }, [PostProps.postShared.post_attributes.like_number]);

  // Like color
  const [likeColor, setLikeColor] = useState(themeColorSet.colorText1);
  useEffect(() => {
    PostProps.postShared.is_liked
      ? setLikeColor('red')
      : setLikeColor(themeColorSet.colorText1);
  }, [PostProps.postShared.is_liked, change]);

  // isLiked
  const [isLiked, setIsLiked] = useState(true);
  useEffect(() => {
    setIsLiked(PostProps.postShared.is_liked);
  }, [PostProps.postShared.is_liked]);

  //format date to get full date
  const date = formatDateTime(PostProps.postShared.createdAt);

  //format date to get full date
  const postDate = formatDateTime(
    PostProps.postShared.post_attributes.post!.createdAt
  );

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    mutateDeletePost(PostProps.postShared._id);

    setIsModalOpen(false);
    openNotificationWithIcon('success');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // post setting
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="item flex items-center px-4 py-2">
          <FontAwesomeIcon className="icon" icon={faUpRightFromSquare} />
          <span className="ml-2">Open post in new tab</span>
        </div>
      ),
      onClick: () => {
        window.open(`/post/${PostProps.postShared._id}`, '_blank')?.focus();
      }
    },
    {
      key: '2',
      label: (
        <div key="2" className="item flex items-center px-4 py-2">
          <FontAwesomeIcon className="icon" icon={faTrash} />
          <span className="ml-2">Delete Post</span>
        </div>
      ),
      onClick: () => {
        showModal();
      }
    }
  ];

  // Notification delete post
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Delete Successfully',
      placement: 'bottomRight'
    });
  };

  // Open OtherPostDetailModal
  const [isOpenPostDetail, setIsOpenPostDetail] = useState(false);

  // Read more
  const [expanded, setExpanded] = useState(false);

  const displayContent =
    expanded ||
    PostProps.postShared.post_attributes.post!.post_attributes.content!
      .length <= 250
      ? PostProps.postShared.post_attributes.post?.post_attributes.content
      : PostProps.postShared.post_attributes.post?.post_attributes.content?.slice(
          0,
          200
        ) + '...';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // ------------------------ View ------------------------
  const postShareRef = useRef(null);

  const onIntersect = () => {
    mutateViewPost(PostProps.postShared._id);
  };

  useIntersectionObserver(postShareRef, onIntersect);

  const { userID } = useAppSelector((state) => state.auth);

  return (
    <StyleTotal theme={themeColorSet} className="rounded-lg mb-4">
      {contextHolder}
      <Modal
        title={
          <>
            <FontAwesomeIcon
              className="icon mr-2"
              icon={faTriangleExclamation}
              style={{ color: commonColor.colorWarning1 }}
            />
            <span>Are you sure delete this post?</span>
          </>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            backgroundColor: commonColor.colorBlue1
          }
        }}
        cancelButtonProps={{
          style: {
            color: themeColorSet.colorText1,
            backgroundColor: themeColorSet.colorBg3
          }
        }}>
        <p>You will not be able to recover files after deletion!</p>
      </Modal>
      {isOpenPostDetail && (
        <OpenMyPostDetailModal
          key={PostProps.postShared._id}
          isShared={true}
          post={PostProps.postShared}
          userInfo={PostProps.userInfo}
          ownerInfo={PostProps.ownerInfo}
          visible={isOpenPostDetail}
          setVisible={setIsOpenPostDetail}
        />
      )}
      <div ref={postShareRef} className="post px-4 py-3">
        <div className="postHeader flex justify-between items-center">
          <div className="postHeader__left">
            <div className="name_avatar flex">
              <Avatar size={50} src={PostProps.userInfo.user_image} />
              <div className="name ml-2">
                <Popover
                  overlayInnerStyle={{
                    border: `1px solid ${themeColorSet.colorBg3}`
                  }}
                  mouseEnterDelay={0.4}
                  content={
                    <PopupInfoUser
                      userInfo={PostProps.userInfo}
                      userID={userID!}
                    />
                  }>
                  <div className="name__top font-bold">
                    <NavLink
                      to={`/user/${PostProps.userInfo._id}`}
                      style={{ color: themeColorSet.colorText1 }}>
                      {PostProps.userInfo?.name}
                    </NavLink>
                  </div>
                </Popover>
                <div
                  className="time"
                  style={{ color: themeColorSet.colorText3 }}>
                  <NavLink
                    to={`/post/${PostProps.postShared._id}`}
                    style={{ color: themeColorSet.colorText3 }}>
                    {/* <span>{'Data Analyst'} • </span> */}
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
                trigger={['click']}>
                <FontAwesomeIcon size="lg" icon={faEllipsis} />
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="space-align-block">
          <div className="postHeader flex justify-between items-center">
            <div className="postHeader__left">
              <div className="name_avatar flex">
                <Avatar size={50} src={PostProps.ownerInfo.user_image} />
                <div className="name ml-2">
                  <Popover
                    overlayInnerStyle={{
                      border: `1px solid ${themeColorSet.colorBg3}`
                    }}
                    mouseEnterDelay={0.4}
                    content={
                      <PopupInfoUser
                        userInfo={PostProps.ownerInfo}
                        userID={userID!}
                      />
                    }>
                    <div className="name__top font-bold">
                      <NavLink
                        to={`/user/${PostProps.ownerInfo._id}`}
                        style={{ color: themeColorSet.colorText1 }}>
                        {PostProps.ownerInfo.name}
                      </NavLink>
                    </div>
                  </Popover>
                  <div
                    className="time"
                    style={{ color: themeColorSet.colorText3 }}>
                    <NavLink
                      to={`/post/${PostProps.postShared._id}`}
                      style={{ color: themeColorSet.colorText3 }}>
                      {/* <span>{'Data Analyst'} • </span> */}
                      <span>{postDate}</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="postBody mt-5">
            <div className="title font-bold">
              {PostProps.postShared.post_attributes.post?.post_attributes.title}
            </div>
            <div className="content mt-3">
              <div className="content__text">
                <ReactQuill
                  value={displayContent}
                  readOnly={true}
                  theme={'bubble'}
                />
                {PostProps.postShared.post_attributes.post!.post_attributes
                  .content!.length > 250 && (
                  <a onClick={toggleExpanded}>
                    {expanded ? 'Read less' : 'Read more'}
                  </a>
                )}
              </div>
              {PostProps.postShared.post_attributes.post?.post_attributes
                .img ? (
                <div className="contentImage mt-3">
                  <Image
                    src={
                      PostProps.postShared.post_attributes.post.post_attributes
                        .img
                    }
                    alt=""
                    style={{ width: '100%' }}
                  />
                </div>
              ) : link ? (
                <a
                  href={link.address}
                  target="_blank"
                  style={{
                    color: themeColorSet.colorText2
                  }}>
                  <div
                    className="contentLink flex justify-between mt-5 px-3 py-3 cursor-pointer"
                    style={{ backgroundColor: themeColorSet.colorBg4 }}>
                    <div className="left w-4/5 p-2">
                      <div
                        className="mb-2"
                        style={{
                          fontWeight: 600,
                          color: themeColorSet.colorText1
                        }}>
                        {link.title?.length > 100
                          ? link.title.slice(0, 100) + '...'
                          : link.title}
                      </div>
                      <div>
                        {link.description?.length > 100
                          ? link.description.slice(0, 100) + '...'
                          : link.description}
                      </div>
                    </div>
                    <img
                      src={link.image}
                      alt=""
                      className="w-1/5"
                      style={{
                        maxWidth: '120px'
                      }}
                    />
                  </div>
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="postFooter flex justify-between items-center">
          <div className="like_share flex justify-between w-1/5">
            <Space className="like" direction="vertical" align="center">
              <span>
                {likeNumber}
                {likeNumber > 1 ? ' Likes' : ' Like'}
              </span>
              <Avatar
                className="item"
                style={{ backgroundColor: 'transparent' }}
                icon={<FontAwesomeIcon icon={faHeart} color={likeColor} />}
                onClick={() => {
                  if (isLiked) {
                    setLikeNumber(likeNumber - 1);
                    setLikeColor(themeColorSet.colorText1);
                    setIsLiked(false);
                  } else {
                    setLikeNumber(likeNumber + 1);
                    setLikeColor('red');
                    setIsLiked(true);
                  }

                  mutateLikePost({
                    post: PostProps.postShared._id,
                    owner_post:
                      PostProps.postShared.post_attributes.owner_post!._id
                  });
                }}
              />
            </Space>
          </div>
          <div className="comment_view flex justify-between w-1/3">
            <Space className="like" direction="vertical" align="center">
              <span>
                {PostProps.postShared.post_attributes.comment_number}
                {PostProps.postShared.post_attributes.comment_number > 1
                  ? ' Comments'
                  : ' Comment'}
              </span>
              <Avatar
                className="item"
                style={{ backgroundColor: 'transparent' }}
                icon={
                  <FontAwesomeIcon
                    icon={faComment}
                    color={themeColorSet.colorText1}
                  />
                }
                onClick={() => setIsOpenPostDetail(true)}
              />
            </Space>
            <Space className="like" direction="vertical" align="center">
              <span>
                {PostProps.postShared.post_attributes.view_number}{' '}
                {PostProps.postShared.post_attributes.view_number > 1
                  ? 'Views'
                  : 'View'}
              </span>
              <Space>
                <Avatar
                  className="item"
                  style={{ backgroundColor: 'transparent' }}
                  icon={<FontAwesomeIcon icon={faShareNodes} />}
                />
              </Space>
            </Space>
          </div>
        </div>
      </div>
    </StyleTotal>
  );
};

export default MyPostShare;
