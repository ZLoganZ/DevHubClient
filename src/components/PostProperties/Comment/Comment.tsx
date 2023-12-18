import { useChildCommentsData } from '@/hooks/fetch';
import CommentDetail from '../CommentDetail';
import { ICommentPost } from '@/types';

interface ICommentProps {
  comment: ICommentPost;
}

const Comment: React.FC<ICommentProps> = ({ comment }) => {
  const { childComments, isLoadingChildComments } = useChildCommentsData(comment._id, comment.post);

  return (
    <CommentDetail key={comment._id} comment={comment} postID={comment.post}>
      {isLoadingChildComments ? (
        <>Loading...</>
      ) : (
        childComments.map((childComment) => (
          <CommentDetail key={childComment._id} comment={childComment} postID={comment.post} isChild />
        ))
      )}
    </CommentDetail>
  );
};

export default Comment;
