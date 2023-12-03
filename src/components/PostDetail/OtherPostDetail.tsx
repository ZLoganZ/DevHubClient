import { useEffect, useState } from 'react';
import { Col, Row, Skeleton } from 'antd';

import CommentDetail from '@/components/PostProperties/CommentDetail';
import OtherPost from '@/components/Post/OtherPost';
import CommentInput from '@/components/PostProperties/CommentInput';
import OtherPostShare from '@/components/Post/OtherPostShare';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCommentsData } from '@/hooks/fetch';
import { setHandleInput } from '@/redux/Slice/CommentSlice';
import { IPost, IUserInfo } from '@/types';
import StyleProvider from './cssPostDetail';
import { useMediaQuery } from 'react-responsive';

interface IOtherPostDetailProps {
  post: IPost;
  postAuthor: IUserInfo;
  currentUser: IUserInfo;
  isDetail?: boolean;
}

const OtherPostDetail: React.FC<IOtherPostDetailProps> = ({ post, postAuthor, currentUser, isDetail }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
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
  
  return (
    <StyleProvider theme={themeColorSet}>
      <Row>
        <Col offset={0} span={24}>
          <div
            className='postDetail'
            style={
              !isDetail
                ? {
                    overflow: 'auto',
                    backgroundColor: themeColorSet.colorBg2,
                    maxHeight: 'calc(100vh - 200px)'
                  }
                : {
                    backgroundColor: themeColorSet.colorBg2
                  }
            }>
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
              className='commentTotal px-3 ml-4 md:px-0 md:ml-0'
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
                      user: currentUser,
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
            {isDetail && <CommentInput key={post._id} currentUser={currentUser} postID={post._id} />}
          </div>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default OtherPostDetail;
