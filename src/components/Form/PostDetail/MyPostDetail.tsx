import CommentDetail from '../../CommentDetail';
import { useState, useEffect } from 'react';
import MyPostShare from '../../Post/MyPostShare';
import MyPost from '../../Post/MyPost';
import StyleTotal from './cssPostDetail';

interface PostProps {
  post: any;
  userInfo: any;
  data: any;
  onData: (data: any) => void;
  postShare?: any;
  owner?: any;
}

const MyPostDetail = (Props: PostProps) => {
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(Props.data.idComment);

  useEffect(() => {
    setSelectedCommentId(Props.data.idComment);
  }, [Props.data]);

  const handleSelectComment = (commentId: string | null) => {
    setSelectedCommentId(commentId);
  };

  return (
    <StyleTotal>
      <div className="postDetail">
        {Props.postShare ? (
          <MyPostShare post={Props.post} userInfo={Props.userInfo} owner={Props.owner} />
        ) : (
          <MyPost post={Props.post} userInfo={Props.userInfo} />
        )}
        <div
          className="commentTotal px-3 ml-4"
          style={{
            maxHeight: '30rem',
            overflow: 'auto',
          }}
        >
          {Props.post?.comments?.map((item: any) => {
            return (
              <div className="px-4" key={item?._id}>
                {item ? (
                  <CommentDetail
                    onData={Props.onData}
                    key={item?._id}
                    comment={item}
                    userInfo={Props.userInfo}
                    selectedCommentId={selectedCommentId}
                    onSelectComment={handleSelectComment}
                    postID={Props.post._id}
                  >
                    {item.listReply?.map((item: any, index: number) => {
                      return (
                        <CommentDetail
                          onData={Props.onData}
                          key={item?._id}
                          comment={item}
                          userInfo={Props.userInfo}
                          selectedCommentId={selectedCommentId}
                          onSelectComment={handleSelectComment}
                          isReply={true}
                          postID={Props.post._id}
                        />
                      );
                    })}
                  </CommentDetail>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </StyleTotal>
  );
};

export default MyPostDetail;
