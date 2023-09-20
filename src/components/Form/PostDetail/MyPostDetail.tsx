import { useState, useEffect } from 'react';

import MyPostShare from '@/components/Post/MyPostShare';
import CommentDetail from '@/components/CommentDetail';
import MyPost from '@/components/Post/MyPost';
import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppSelector, useCommentsData } from '@/hooks';
import { PostType, UserInfoType, SelectedCommentValues } from '@/types';
import StyleTotal from './cssPostDetail';

interface PostProps {
  post: PostType;
  userInfo: UserInfoType;
  data: SelectedCommentValues;
  handleData: (data: SelectedCommentValues) => void;
  isShared?: boolean;
  ownerInfo?: UserInfoType;
}

const MyPostDetail = (Props: PostProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const [selectedCommentID, setSelectedCommentId] = useState<string | null>(
    Props.data.idComment
  );

  const { comments } = useCommentsData(Props.post._id);

  useEffect(() => {
    setSelectedCommentId(Props.data.idComment);
  }, [Props.data]);

  const handleSelectComment = (commentID: string | null) => {
    setSelectedCommentId(commentID);
  };

  return (
    <StyleTotal theme={themeColorSet}>
      <div className="postDetail">
        {Props.isShared ? (
          <MyPostShare
            key={Props.post._id}
            postShared={Props.post}
            userInfo={Props.userInfo}
            ownerInfo={Props.ownerInfo!}
          />
        ) : (
          <MyPost post={Props.post} userInfo={Props.userInfo} />
        )}
        <div
          className="commentTotal px-3 ml-4"
          style={{
            maxHeight: '30rem',
            overflow: 'auto'
          }}>
          {comments?.map((item) => {
            return (
              <div className="px-4" key={item._id}>
                {item ? (
                  <CommentDetail
                    handleData={Props.handleData}
                    key={item._id}
                    comment={item}
                    userInfo={Props.userInfo}
                    selectedCommentID={selectedCommentID}
                    onSelectComment={handleSelectComment}
                    postID={Props.post._id}>
                    {/* {item.listReply?.map((item: any) => {
                      return (
                        <CommentDetail
                          handleData={Props.handleData}
                          key={item?._id}
                          comment={item}
                          userInfo={Props.userInfo}
                          selectedCommentID={selectedCommentID}
                          onSelectComment={handleSelectComment}
                          isReply={true}
                          postID={Props.post.id}
                        />
                      );
                    })} */}
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
