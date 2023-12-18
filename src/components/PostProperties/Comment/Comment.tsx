import { useChildCommentsData, useCurrentUserInfo } from '@/hooks/fetch';
import CommentDetail from '../CommentDetail';
import { ICommentPost } from '@/types';
import { useEffect, useState } from 'react';
import StyleProvider from './cssComment';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { setHandleChildInput } from '@/redux/Slice/CommentSlice';

interface ICommentProps {
  comment: ICommentPost;
}

const Comment: React.FC<ICommentProps> = ({ comment }) => {
  const dispatch = useAppDispatch();

  const { currentUserInfo } = useCurrentUserInfo();

  const { idComment, isReply } = useAppSelector((state) => state.modalHOC.data);

  const { childComments, isLoadingChildComments } = useChildCommentsData(comment._id, comment.post);

  const [content, setContent] = useState<string>('');

  const handleCommentInput = (value: string) => {
    setContent(value);
  };

  useEffect(() => {
    if (isReply && idComment === comment._id) {
      dispatch(setHandleChildInput(handleCommentInput));
    }
  }, [isReply, idComment]);

  useEffect(() => {
    if (content !== '') {
      setContent('');
    }
  }, [childComments]);

  return (
    <StyleProvider>
      <CommentDetail comment={comment} postID={comment.post}>
        <div className='container'>
          <div className='overlay'></div>
          {content !== '' && idComment == comment._id && (
            <CommentDetail
              key={comment.post}
              postID={comment.post}
              comment={{
                _id: '1',
                post: comment.post,
                user: currentUserInfo,
                content: content,
                type: 'child',
                is_liked: false,
                is_disliked: false,
                likes: [],
                dislikes: [],
                like_number: 0,
                dislike_number: 0,
                child_number: 0,
                createdAt: 'sending...'
              }}
            />
          )}
        </div>
        {comment.child_number === 0 ? null : isLoadingChildComments ? (
          <>Loading...</>
        ) : (
          childComments.map((childComment) => (
            <CommentDetail comment={childComment} postID={comment.post} key={childComment._id} isChild />
          ))
        )}
      </CommentDetail>
    </StyleProvider>
  );
};

export default Comment;
