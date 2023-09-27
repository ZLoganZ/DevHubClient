import { useState, useEffect } from 'react';

import CommentDetail from '@/components/CommentDetail';
import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useCommentsData } from '@/hooks/fetch';
import { PostType, SelectedCommentValues, UserInfoType } from '@/types';
import StyleProvider from './cssPostDetail';
import { Skeleton } from 'antd';

interface PostProps {
  post: PostType;
  userInfo: UserInfoType;
  data: SelectedCommentValues;
  handleData: (data: SelectedCommentValues) => void;
  isShared?: boolean;
  ownerInfo?: UserInfoType;
}

const OtherPostDetail = (Props: PostProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const [selectedCommentID, setSelectedCommentId] = useState<string | null>(
    Props.data.idComment
  );

  const { comments, isLoadingComments } = useCommentsData(Props.post._id);

  useEffect(() => {
    setSelectedCommentId(Props.data.idComment);
  }, [Props.data]);

  const handleSelectComment = (commentID: string | null) => {
    setSelectedCommentId(commentID);
  };

  return (
    <StyleProvider theme={themeColorSet}>
      <div className="postDetail">
        {Props.isShared ? (
          <OtherPostShare
            key={Props.post._id}
            postShared={Props.post}
            userInfo={Props.userInfo}
            ownerInfo={Props.ownerInfo!}
          />
        ) : (
          <OtherPost
            key={Props.post._id}
            post={Props.post}
            userInfo={Props.userInfo}
          />
        )}
        <div
          className="commentTotal px-3 ml-4"
          style={{
            maxHeight: '30rem',
            overflow: 'auto'
          }}>
          {isLoadingComments &&
          Props.post.post_attributes.comment_number > 0 ? (
            <Skeleton avatar paragraph={{ rows: 2 }} active />
          ) : (
            comments?.map((item) => {
              return (
                <div key={item._id}>
                  {item ? (
                    <CommentDetail
                      key={item._id}
                      handleData={Props.handleData}
                      comment={item}
                      userInfo={Props.userInfo}
                      selectedCommentID={selectedCommentID}
                      onSelectComment={handleSelectComment}
                      postID={Props.post._id}>
                      {/* {item.listReply?.map((item: any) => {
                      return (
                        <CommentDetail
                          key={item?._id}
                          handleData={Props.handleData}
                          comment={item}
                          userInfo={Props.userInfo}
                          selectedCommentID={selectedCommentID}
                          onSelectComment={handleSelectComment}
                          isReply={true}
                          postID={Props.post._id}
                        />
                      );
                    })} */}
                    </CommentDetail>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </StyleProvider>
  );
};

export default OtherPostDetail;
