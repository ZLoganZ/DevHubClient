import { ForwardRefExoticComponent, ReactNode, useState } from 'react';
import { Comment } from '@ant-design/compatible';
import { Avatar, ConfigProvider, Skeleton, Tooltip } from 'antd';
import Icon, {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined
} from '@ant-design/icons';

import { getTheme } from '@/util/functions/ThemeFunction';
import StyleTotal from '@/components/Post/cssPost';
import {
  DISLIKE_COMMENT_POST_SAGA,
  LIKE_COMMENT_POST_SAGA
} from '@/redux/ActionSaga/PostActionSaga';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { CommentType, SelectedCommentValues, UserInfoType } from '@/types';

interface CommentProps {
  comment: CommentType;
  userInfo: UserInfoType;
  children?: ReactNode;
  handleData: (data: SelectedCommentValues) => void;
  selectedCommentID?: string | null;
  onSelectComment: (commentID: string | null) => void;
  isReply?: boolean;
  postID?: string;
}

const CommentDetail = (Props: CommentProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const dispatch = useAppDispatch();

  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [likes, setLike] = useState(Props.comment.like_number || 0);
  const [dislikes, setDislike] = useState(Props.comment.like_number || 0);
  const [action, setAction] = useState(
    Props.comment.is_liked || Props.comment.is_disliked
      ? Props.comment.is_liked
        ? 'liked'
        : 'disliked'
      : ''
  );

  const like = () => {
    if (action === 'liked') {
      setLike((prev) => prev - 1);
      setAction('');
    } else {
      setLike((prev) => prev + 1);
      if (action === 'disliked') setDislike((prev) => prev - 1);
      setAction('liked');
    }
    dispatch(
      LIKE_COMMENT_POST_SAGA({
        id: Props.comment._id,
        comment: {
          type: Props.isReply ? 'child' : 'parent',
          post: Props.postID!
        }
      })
    );
  };

  const dislike = () => {
    if (action === 'disliked') {
      setDislike((prev) => prev - 1);
      setAction('');
    } else {
      setDislike((prev) => prev + 1);
      if (action === 'liked') setLike((prev) => prev - 1);
      setAction('disliked');
    }
    dispatch(
      DISLIKE_COMMENT_POST_SAGA({
        id: Props.comment._id,
        comment: {
          type: Props.isReply ? 'child' : 'parent',
          post: Props.postID!
        }
      })
    );
  };

  const setReply = () => {
    const selectedCommentID =
      Props.selectedCommentID === Props.comment._id ? null : Props.comment._id;
    Props.handleData({
      isReply: selectedCommentID ? true : false,
      idComment: selectedCommentID
    });
    Props.onSelectComment(selectedCommentID);
  };

  const actions = [
    <span key="comment-basic-like">
      <Tooltip title="Like">
        <Icon
          type="like"
          component={
            action === 'liked'
              ? (LikeFilled as ForwardRefExoticComponent<any>)
              : (LikeOutlined as ForwardRefExoticComponent<any>)
          }
          onClick={like}
          style={{
            fontSize: '0.9rem'
          }}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
    </span>,
    <span key="comment-basic-dislike">
      <Tooltip title="Dislike">
        <Icon
          type="dislike"
          component={
            action === 'disliked'
              ? (DislikeFilled as ForwardRefExoticComponent<any>)
              : (DislikeOutlined as ForwardRefExoticComponent<any>)
          }
          onClick={dislike}
          style={{
            fontSize: '0.9rem'
          }}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{dislikes}</span>
    </span>,
    {
      ...(Props.isReply ? (
        <></>
      ) : (
        <span
          id="reply"
          key="comment-basic-reply-to"
          onClick={setReply}
          {...(Props.selectedCommentID === Props.comment._id
            ? {
                style: {
                  color: '#1890ff',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }
              }
            : {
                style: {
                  color: '#D4D4D4A6',
                  fontWeight: 'normal',
                  fontSize: '0.9rem'
                }
              })}>
          <span style={{ color: themeColorSet.colorText3 }}>
            {Props.selectedCommentID === Props.comment._id ? 'Cancel' : 'Reply'}
          </span>
        </span>
      ))
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        {!Props.comment?.user?.name ? (
          <Skeleton avatar paragraph={{ rows: 2 }} active />
        ) : (
          <div className="commentDetail">
            <Comment
              author={
                <div
                  style={{
                    fontWeight: 600,
                    color: themeColorSet.colorText1,
                    fontSize: '0.85rem'
                  }}>
                  {Props.comment?.user?.name}
                </div>
              }
              actions={actions}
              avatar={
                Props.comment.user.user_image ? (
                  <Avatar
                    src={Props.comment.user.user_image}
                    alt={Props.comment.user.name}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: '#87d068' }}
                    icon="user"
                    alt={Props.comment.user.name}
                  />
                )
              }
              content={<div className="">{Props.comment.content}</div>}>
              {Props.children}
            </Comment>
          </div>
        )}
      </StyleTotal>
    </ConfigProvider>
  );
};

export default CommentDetail;
