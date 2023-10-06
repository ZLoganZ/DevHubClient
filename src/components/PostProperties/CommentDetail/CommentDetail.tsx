import { useEffect, useState } from 'react';
import { Comment } from '@ant-design/compatible';
import { Avatar, Tooltip } from 'antd';
import Icon, { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useDislikeComment, useLikeComment } from '@/hooks/mutation';
import { setData } from '@/redux/Slice/ModalHOCSlice';
import { CommentType } from '@/types';
import StyleProvider from './cssCommentDetail';

interface CommentProps {
  comment: CommentType;
  postID: string;
  children?: React.ReactNode;
  isReply?: boolean;
}

const CommentDetail = ({ comment, children, postID }: CommentProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const dispatch = useAppDispatch();

  const { idComment, isReply } = useAppSelector((state) => state.modalHOC.data);

  const { mutateLikeComment } = useLikeComment();
  const { mutateDislikeComment } = useDislikeComment();

  const { themeColorSet } = getTheme();

  const [likes, setLike] = useState(comment.like_number || 0);
  const [dislikes, setDislike] = useState(comment.dislike_number || 0);
  const [action, setAction] = useState('');

  useEffect(() => {
    if (comment.is_liked) {
      setAction('liked');
    } else if (comment.is_disliked) {
      setAction('disliked');
    }
  }, [comment.is_liked, comment.is_disliked]);

  const like = () => {
    if (action === 'liked') {
      setLike((prev) => prev - 1);
      setAction('');
    } else {
      setLike((prev) => prev + 1);
      if (action === 'disliked') setDislike((prev) => prev - 1);
      setAction('liked');
    }

    mutateLikeComment({
      id: comment._id,
      comment: {
        type: isReply ? 'child' : 'parent',
        post: postID,
        owner_comment: comment.user._id
      }
    });
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

    mutateDislikeComment({
      id: comment._id,
      comment: {
        type: isReply ? 'child' : 'parent',
        post: postID,
        owner_comment: comment.user._id
      }
    });
  };

  const setReply = () => {
    const _selectedCommentID = idComment === comment._id ? null : comment._id;
    dispatch(
      setData({
        isReply: _selectedCommentID ? true : false,
        idComment: _selectedCommentID,
        name: comment.user.name,
        user_image: comment.user.user_image
      })
    );
  };

  const actions = [
    <span key='comment-basic-like'>
      <Tooltip title='Like'>
        <Icon
          type='like'
          component={
            action === 'liked'
              ? (LikeFilled as React.ForwardRefExoticComponent<any>)
              : (LikeOutlined as React.ForwardRefExoticComponent<any>)
          }
          onClick={like}
          style={{
            fontSize: '0.9rem'
          }}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
    </span>,
    <span key='comment-basic-dislike'>
      <Tooltip title='Dislike'>
        <Icon
          type='dislike'
          component={
            action === 'disliked'
              ? (DislikeFilled as React.ForwardRefExoticComponent<any>)
              : (DislikeOutlined as React.ForwardRefExoticComponent<any>)
          }
          onClick={dislike}
          style={{
            fontSize: '0.9rem'
          }}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{dislikes}</span>
    </span>,

    <span
      id='reply'
      key='comment-basic-reply-to'
      onClick={setReply}
      {...(idComment === comment._id
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
        {idComment === comment._id ? 'Cancel' : 'Reply'}
      </span>
    </span>
  ];

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='commentDetail'>
        <Comment
          actions={actions}
          author={
            <NavLink
              to={`/user/${comment.user._id}`}
              style={{
                fontWeight: 600,
                color: themeColorSet.colorText1,
                fontSize: '0.8rem'
              }}>
              {comment.user.name}
            </NavLink>
          }
          datetime={
            <div
              style={{
                color: themeColorSet.colorText3
              }}>
              {comment.createdAt === 'sending...' ? comment.createdAt : formatDateTime(comment.createdAt)}
            </div>
          }
          avatar={
            comment.user.user_image ? (
              <Avatar src={comment.user.user_image} alt={comment.user.name} />
            ) : (
              <Avatar style={{ backgroundColor: '#87d068' }} icon='user' alt={comment.user.name} />
            )
          }
          content={comment.content}>
          {children}
        </Comment>
      </div>
    </StyleProvider>
  );
};

export default CommentDetail;
