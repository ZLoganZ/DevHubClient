import { Col, Row, Skeleton } from 'antd';

import CommentDetail from '@/components/PostProperties/CommentDetail';
import OtherPost from '@/components/Post/OtherPost';
import OtherPostShare from '@/components/Post/OtherPostShare';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useCommentsData } from '@/hooks/fetch';
import { PostType, UserInfoType } from '@/types';
import StyleProvider from './cssPostDetail';
import CommentInput from '../PostProperties/CommentInput';
import { useEffect, useState } from 'react';

interface PostProps {
  post: PostType;
  postAuthor: UserInfoType;
  currentUser: UserInfoType;
  inclCommentInput?: boolean;
}

const OtherPostDetail = ({ post, postAuthor, currentUser, inclCommentInput }: PostProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { comments, isLoadingComments } = useCommentsData(post._id);

  const [commentInput, setCommentInput] = useState('');

  const handleCommentInput = (value: string) => {
    setCommentInput(value);
  };

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
            style={{
              overflow: 'auto',
              backgroundColor: themeColorSet.colorBg2,
              maxHeight: 'calc(100vh - 200px)',
              minHeight: 'calc(100vh - 5rem)'
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
              <div>
                {commentInput !== '' ? (
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
                ) : null}
              </div>
              {isLoadingComments && post.post_attributes.comment_number > 0 ? (
                <Skeleton avatar paragraph={{ rows: 2 }} active />
              ) : (
                comments?.map((item) => {
                  return <CommentDetail key={item._id} comment={item} postID={post._id} />;
                })
              )}
            </div>
            {inclCommentInput && <CommentInput key={post._id} currentUser={currentUser} postID={post._id} handleCommentInput={handleCommentInput}/>}
          </div>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default OtherPostDetail;
