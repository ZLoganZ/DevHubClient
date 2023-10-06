import { useState, useEffect } from 'react';
import { Col, Row, Skeleton } from 'antd';

import CommentDetail from '@/components/PostProperties/CommentDetail';
import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import CommentInput from '@/components/PostProperties/CommentInput';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useCommentsData } from '@/hooks/fetch';
import { PostType, SelectedCommentValues, UserInfoType } from '@/types';
import StyleProvider from './cssPostDetail';

interface PostProps {
  post: PostType;
  postAuthor: UserInfoType;
  currentUser: UserInfoType;
}

const OtherPostDetail = ({ post, postAuthor, currentUser }: PostProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const [selectedCommentID, setSelectedCommentId] = useState<string | null>();
  const [data, setData] = useState<SelectedCommentValues>({
    isReply: false,
    idComment: null,
    name: null,
    user_image: null
  });

  const { comments, isLoadingComments } = useCommentsData(post._id);

  useEffect(() => {
    setSelectedCommentId(data.idComment);
  }, [data]);

  const handleSelectComment = (commentID: string | null) => {
    setSelectedCommentId(commentID);
  };

  return (
    <StyleProvider theme={themeColorSet}>
      <Row>
        <Col offset={0} span={24}>
          <div
            className='postDetail'
            style={{
              backgroundColor: themeColorSet.colorBg2
            }}>
            {post.type === 'Share' ? (
              <OtherPostShare
                postShared={post}
                postAuthor={postAuthor}
                postSharer={post.post_attributes.owner_post!}
                currentUser={currentUser}
              />
            ) : (
              <OtherPost post={post} postAuthor={postAuthor} currentUser={currentUser} />
            )}
            <div
              className='commentTotal px-3 ml-4'
              style={{
                maxHeight: '30rem'
                // overflow: 'auto'
              }}>
              {isLoadingComments && post.post_attributes.comment_number > 0 ? (
                <Skeleton avatar paragraph={{ rows: 2 }} active />
              ) : (
                comments?.map((item) => {
                  return (
                    <div key={item._id}>
                      {item ? (
                        <CommentDetail
                          key={item._id}
                          handleData={setData}
                          comment={item}
                          postAuthor={postAuthor}
                          selectedCommentID={selectedCommentID}
                          onSelectComment={handleSelectComment}
                          postID={post._id}
                        />
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
            <CommentInput key={post._id} data={data} postID={post._id} currentUser={currentUser} />
          </div>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default OtherPostDetail;
