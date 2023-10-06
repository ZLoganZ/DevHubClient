import { Col, Row, Skeleton } from 'antd';
import { useState, useEffect } from 'react';

import MyPostShare from '@/components/Post/MyPostShare';
import CommentDetail from '@/components/PostProperties/CommentDetail';
import MyPost from '@/components/Post/MyPost';
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

const MyPostDetail = ({ post, postAuthor, currentUser }: PostProps) => {
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
      <Row className='py-4'>
        <Col offset={3} span={18}>
          <div
            className='postDetail rounded-lg'
             style={{
              overflow: 'auto',
              backgroundColor: themeColorSet.colorBg2,
              maxHeight: 'calc(100vh - 200px)',
              minHeight: 'calc(100vh - 5rem)'
            }}>
            {post.type === 'Share' ? (
              <MyPostShare
                postShared={post}
                postAuthor={postAuthor}
                postSharer={post.post_attributes.owner_post!}
              />
            ) : (
              <MyPost post={post} postAuthor={postAuthor} />
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
                          postID={post._id}></CommentDetail>
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

export default MyPostDetail;
