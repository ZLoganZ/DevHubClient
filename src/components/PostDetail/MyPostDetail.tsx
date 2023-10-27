import { Col, Row, Skeleton } from 'antd';
import { useEffect, useState } from 'react';

import MyPostShare from '@/components/Post/MyPostShare';
import CommentDetail from '@/components/PostProperties/CommentDetail';
import CommentInput from '@/components/PostProperties/CommentInput';
import MyPost from '@/components/Post/MyPost';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCommentsData } from '@/hooks/fetch';
import { setHandleInput } from '@/redux/Slice/CommentSlice';
import { PostType, UserInfoType } from '@/types';
import StyleProvider from './cssPostDetail';
import { useMediaQuery } from 'react-responsive';
interface PostProps {
  post: PostType;
  postAuthor: UserInfoType;
  isDetail?: boolean;
}

const MyPostDetail: React.FC<PostProps> = ({ post, postAuthor, isDetail }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();

  const { comments, isLoadingComments } = useCommentsData(post._id);
  const [commentInput, setCommentInput] = useState('');

  const handleCommentInput = (value: string) => {
    setCommentInput(value);
  };

  useEffect(() => {
    dispatch(setHandleInput(handleCommentInput));
  }, []);

  useEffect(() => {
    if (commentInput !== '') {
      setCommentInput('');
    }
  }, [comments]);
  const isXsScreen = useMediaQuery({ maxWidth: 639 });

  return (
    <StyleProvider theme={themeColorSet}>
      <Row>
        <Col offset={0} span={24}>
          <div
            className='postDetail rounded-lg'
            style={
              isDetail
                ? {
                    overflow: 'auto',
                    backgroundColor: themeColorSet.colorBg2,
                    maxHeight: 'calc(100vh - 200px)'
                  }
                : { backgroundColor: themeColorSet.colorBg2 }
            }>
            {!isXsScreen &&
              (post.type === 'Share' ? (
                <MyPostShare
                  postShared={post}
                  postAuthor={postAuthor}
                  postSharer={post.post_attributes.owner_post!}
                />
              ) : (
                <MyPost post={post} postAuthor={postAuthor} />
              ))}
            <div
              className='commentTotal px-3 ml-4 xs:px-0 xs:ml-0'
              style={{
                maxHeight: '30rem'
                // overflow: 'auto'
              }}>
              <div className='container'>
                <div className='overlay'></div>
                {commentInput !== '' && (
                  <CommentDetail
                    key={post._id}
                    comment={{
                      _id: '1',
                      post: post,
                      user: postAuthor,
                      content: commentInput,
                      type: 'parent',
                      is_liked: false,
                      is_disliked: false,
                      likes: [],
                      dislikes: [],
                      like_number: 0,
                      dislike_number: 0,
                      createdAt: 'sending...'
                    }}
                    postID={post._id}
                  />
                )}
              </div>
              {isLoadingComments && post.post_attributes.comment_number > 0 ? (
                <Skeleton avatar paragraph={{ rows: 2 }} active />
              ) : (
                comments?.map((item) => {
                  return <CommentDetail key={item._id} comment={item} postID={post._id} />;
                })
              )}
            </div>
            {isDetail && <CommentInput key={post._id} currentUser={postAuthor} postID={post._id} />}
          </div>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default MyPostDetail;
