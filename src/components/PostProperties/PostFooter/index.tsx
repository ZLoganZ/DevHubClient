import { Avatar, Space } from 'antd';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faComment, faHeart, faShare, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';

import OtherPostDetail from '@/components/PostDetail/OtherPostDetail';
import CommentInput from '@/components/PostProperties/CommentInput';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useLikePost, useSavePost, useSharePost } from '@/hooks/mutation';
import { PostType, UserInfoType } from '@/types';
import { getTheme } from '@/util/theme';
import ConvertNumber from '@/util/convertNumber';
import { openModal } from '@/redux/Slice/ModalHOCSlice';
import StyleProvider from './cssPostFooter';

interface IPostFooter {
  post: PostType;
  postAuthor: UserInfoType;
  isPostShare?: boolean;
  currentUser: UserInfoType;
}

const PostFooter: React.FC<IPostFooter> = ({ post, postAuthor, isPostShare, currentUser }) => {
  const changed = useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();

  const { mutateSharePost } = useSharePost();
  const { mutateSavePost } = useSavePost();
  const { mutateLikePost } = useLikePost();

  const commentNumber = post.post_attributes.comment_number;
  const viewNumber = post.post_attributes.view_number;

  useMediaQuery({ maxWidth: 639 });

  // ------------------------ Like ------------------------

  const [likeNumber, setLikeNumber] = useState(post.post_attributes.like_number);
  const [likeColor, setLikeColor] = useState(themeColorSet.colorText1);
  const [isLiked, setIsLiked] = useState(post.is_liked);

  useEffect(() => {
    setLikeNumber(post.post_attributes.like_number);
    setIsLiked(post.is_liked);
    post.is_liked ? setLikeColor('red') : setLikeColor(themeColorSet.colorText1);
  }, [post.post_attributes.like_number, post.is_liked, changed]);

  // ------------------------ Share ------------------------

  const [shareNumber, setShareNumber] = useState(post.post_attributes.share_number);
  const [shareColor, setShareColor] = useState(themeColorSet.colorText1);
  const [isShared, setIsShared] = useState(post.is_shared);

  useEffect(() => {
    setShareNumber(post.post_attributes.share_number);
    setIsShared(post.is_shared);
    post.is_shared ? setShareColor('blue') : setShareColor(themeColorSet.colorText1);
  }, [post.post_attributes.share_number, post.is_shared, changed]);

  // ------------------------ Save ------------------------

  const [isSaved, setIsSaved] = useState(post.is_saved);
  const [saveColor, setSaveColor] = useState(themeColorSet.colorText1);

  useEffect(() => {
    setIsSaved(post.is_saved);
    post.is_saved ? setSaveColor('yellow') : setSaveColor(themeColorSet.colorText1);
  }, [post.is_saved, changed]);

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='flex justify-between items-center'>
        <div className='like_share flex justify-between w-1/5 xs:w-2/5'>
          <Space className='like' direction='vertical' align='center'>
            <span>
              {ConvertNumber(likeNumber)} like{likeNumber > 1 ? 's' : ''}
            </span>
            <Avatar
              className='item'
              style={{ backgroundColor: 'transparent' }}
              icon={<FontAwesomeIcon icon={faHeart} color={likeColor} />}
              onClick={() => {
                const newLikeNumber = isLiked ? likeNumber - 1 : likeNumber + 1;
                const newLikeColor = isLiked ? themeColorSet.colorText1 : 'red';
                const newIsLiked = !isLiked;

                setLikeNumber(newLikeNumber);
                setLikeColor(newLikeColor);
                setIsLiked(newIsLiked);

                mutateLikePost({
                  post: post._id,
                  owner_post: post.post_attributes.user._id
                });
              }}
            />
          </Space>
          <Space className='like' direction='vertical' align='center' hidden={isPostShare}>
            <span>
              {ConvertNumber(shareNumber)} share{shareNumber > 1 ? 's' : ''}
            </span>
            <Avatar
              className='item'
              style={{ backgroundColor: 'transparent' }}
              icon={<FontAwesomeIcon icon={faShare} color={shareColor} />}
              onClick={() => {
                const newShareNumber = isShared ? shareNumber - 1 : shareNumber + 1;
                const newShareColor = isShared ? themeColorSet.colorText1 : 'blue';
                const newIsShared = !isShared;

                setShareNumber(newShareNumber);
                setShareColor(newShareColor);
                setIsShared(newIsShared);

                mutateSharePost({
                  post: post._id,
                  owner_post: post.post_attributes.user._id
                });
              }}
            />
          </Space>
        </div>
        <div className='comment_view flex justify-between w-1/3 xs:w-6/12'>
          <Space className='like' direction='vertical' align='center'>
            <span>
              {ConvertNumber(commentNumber)} comment{commentNumber > 1 ? 's' : ''}
            </span>
            <Avatar
              className='item'
              style={{ backgroundColor: 'transparent' }}
              icon={<FontAwesomeIcon icon={faComment} color={themeColorSet.colorText1} />}
              onClick={() =>
                dispatch(
                  openModal({
                    title: 'The post of ' + post.post_attributes.user.name,
                    component: (
                      <OtherPostDetail
                        key={post._id}
                        post={post}
                        postAuthor={postAuthor}
                        currentUser={currentUser}
                      />
                    ),
                    footer: <CommentInput key={post._id} postID={post._id} currentUser={currentUser} />,
                    type: 'post'
                  })
                )
              }
            />
          </Space>
          <Space className='like' direction='vertical' align='center'>
            <span>
              {ConvertNumber(viewNumber)} view{viewNumber > 1 ? 's' : ''}
            </span>
            <Space>
              <Avatar
                className='item'
                style={{ backgroundColor: 'transparent' }}
                icon={<FontAwesomeIcon icon={faBookmark} color={saveColor} />}
                onClick={() => {
                  const newIsSaved = !isSaved;
                  const newSaveColor = newIsSaved ? 'yellow' : themeColorSet.colorText1;

                  setIsSaved(newIsSaved);
                  setSaveColor(newSaveColor);

                  mutateSavePost(post._id);
                }}
              />
              <Avatar
                className='item'
                style={{ backgroundColor: 'transparent' }}
                icon={<FontAwesomeIcon icon={faShareNodes} color={themeColorSet.colorText1} />}
              />
            </Space>
          </Space>
        </div>
      </div>
    </StyleProvider>
  );
};

export default PostFooter;
