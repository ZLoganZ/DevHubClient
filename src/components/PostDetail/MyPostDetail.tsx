import { Col, Row, Skeleton } from 'antd';

import MyPostShare from '@/components/Post/MyPostShare';
import CommentDetail from '@/components/PostProperties/CommentDetail';
import MyPost from '@/components/Post/MyPost';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useCommentsData } from '@/hooks/fetch';
import { PostType, UserInfoType } from '@/types';
import StyleProvider from './cssPostDetail';
import CommentInput from '../PostProperties/CommentInput';
interface PostProps {
  post: PostType;
  postAuthor: UserInfoType;
  inclCommentInput?: boolean;
}

const MyPostDetail = ({ post, postAuthor, inclCommentInput }: PostProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { comments, isLoadingComments } = useCommentsData(post._id);

  return (
    <StyleProvider theme={themeColorSet}>
      <Row className='py-4'>
        <Col offset={3} span={18}>
          <div
            className='postDetail rounded-lg'
            style={{
              backgroundColor: themeColorSet.colorBg2
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
                  return <CommentDetail key={item._id} comment={item} postID={post._id} />;
                })
              )}
            </div>
            {inclCommentInput && <CommentInput key={post._id} currentUser={postAuthor} postID={post._id} />}
          </div>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default MyPostDetail;
