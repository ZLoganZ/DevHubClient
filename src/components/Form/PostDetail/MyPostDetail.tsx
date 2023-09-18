import { useState, useEffect } from 'react';

import MyPostShare from '@/components/Post/MyPostShare';
import CommentDetail from '@/components/CommentDetail';
import MyPost from '@/components/Post/MyPost';
import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppSelector } from '@/hooks';
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
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    Props.data.idComment
  );

  useEffect(() => {
    setSelectedCommentId(Props.data.idComment);
  }, [Props.data]);

  const handleSelectComment = (commentId: string | null) => {
    setSelectedCommentId(commentId);
  };

  return (
    <StyleTotal theme={themeColorSet}>
      <div className="postDetail">
        {Props.postShare ? (
          <MyPostShare
            key={Props.post?._id}
            post={Props.post}
            userInfo={Props.userInfo}
            owner={Props.owner}
            detail={true}
          />
        ) : (
          <MyPost post={Props.post} userInfo={Props.userInfo} detail={true} />
        )}
        <div
          className="commentTotal px-3 ml-4"
          style={{
            maxHeight: '30rem',
            overflow: 'auto'
          }}>
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
                    postID={Props.post._id}>
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
