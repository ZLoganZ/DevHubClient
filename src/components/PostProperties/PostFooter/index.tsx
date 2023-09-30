import { Avatar, Space } from 'antd';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faComment, faHeart, faShare, faShareNodes } from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from '@/hooks/special';
import { useLikePost, useSavePost, useSharePost } from '@/hooks/mutation';
import { PostType } from '@/types';
import { getTheme } from '@/util/theme';
import ConvertNumber from '@/util/convertNumber';
import StyleProvider from './cssPostFooter';
import { useMediaQuery } from 'react-responsive';

interface PostFooterProps {
  post: PostType;
  setIsOpenPostDetail: (isOpen: boolean) => void;
  isPostShare?: boolean;
}

const PostFooter = ({ post, setIsOpenPostDetail, isPostShare }: PostFooterProps) => {
  const change = useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateSharePost } = useSharePost();
  const { mutateSavePost } = useSavePost();
  const { mutateLikePost } = useLikePost();

  const commentNumber = post.post_attributes.comment_number;
  const viewNumber = post.post_attributes.view_number;

  // ------------------------ Like ------------------------

  const [likeNumber, setLikeNumber] = useState(post.post_attributes.like_number);
  const [likeColor, setLikeColor] = useState(themeColorSet.colorText1);
  const [isLiked, setIsLiked] = useState(post.is_liked);

  useEffect(() => {
    setLikeNumber(post.post_attributes.like_number);
    setIsLiked(post.is_liked);
    post.is_liked ? setLikeColor('red') : setLikeColor(themeColorSet.colorText1);
  }, [post.post_attributes.like_number, post.is_liked, change]);

  // ------------------------ Share ------------------------

  const [shareNumber, setShareNumber] = useState(post.post_attributes.share_number);
  const [shareColor, setShareColor] = useState(themeColorSet.colorText1);
  const [isShared, setIsShared] = useState(post.is_shared);

  useEffect(() => {
    setShareNumber(post.post_attributes.share_number);
    setIsShared(post.is_shared);
    post.is_shared ? setShareColor('blue') : setShareColor(themeColorSet.colorText1);
  }, [post.post_attributes.share_number, post.is_shared, change]);

  // ------------------------ Save ------------------------

  const [isSaved, setIsSaved] = useState(post.is_saved);
  const [saveColor, setSaveColor] = useState(themeColorSet.colorText1);

  useEffect(() => {
    setIsSaved(post.is_saved);
    post.is_saved ? setSaveColor('yellow') : setSaveColor(themeColorSet.colorText1);
  }, [post.is_saved, change]);
  const isXsScreen = useMediaQuery({ maxWidth: 639 });

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
              onClick={() => setIsOpenPostDetail(true)}
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
                icon={<FontAwesomeIcon icon={faShareNodes} />}
              />
            </Space>
          </Space>
        </div>
      </div>
    </StyleProvider>
  );
};

export default PostFooter;