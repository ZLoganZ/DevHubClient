import { Avatar, Input, Popover } from 'antd';
import { useMemo, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';

import MyPostDetail from '@/components/PostDetail/MyPostDetail';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCommentPost } from '@/hooks/mutation';
import { useUserInfo } from '@/hooks/fetch';
import { PostType, SelectedCommentValues, UserInfoType } from '@/types';
import StyleProvider from './cssOpenPostDetailModal';
import { openModal, setFooter } from '@/redux/Slice/ModalHOCSlice';

interface PostProps {
  post: PostType;
  userInfo: UserInfoType;
  isShared?: boolean;
  ownerInfo?: UserInfoType;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const OpenMyPostDetailModal = (PostProps: PostProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { visible } = useAppSelector((state) => state.modalHOC);

  const dispatch = useAppDispatch();

  const [commentContent, setCommentContent] = useState('');
  const [cursor, setCursor] = useState(0);

  const inputRef = useRef<any>();

  const { mutateCommentPost } = useCommentPost();

  const [data, setData] = useState<SelectedCommentValues>({
    isReply: false,
    idComment: null
  });

  useEffect(() => {
    PostProps.setVisible(visible);
  }, [visible]);

  const handleData = (data: SelectedCommentValues) => {
    setData(data);
  };

  useEffect(() => {
    if (data.isReply) inputRef.current.focus();
  }, [data]);

  useEffect(() => {
    if (!PostProps.visible) setCommentContent('');
  }, [PostProps.visible]);

  const { userInfo } = useUserInfo();

  const handleSubmitComment = () => {
    const { post } = PostProps;
    const { isReply, idComment } = data;

    if (checkEmpty()) return;

    mutateCommentPost({
      content: commentContent,
      post: post._id,
      type: isReply ? 'child' : 'parent',
      parent: isReply ? idComment! : undefined
    });

    setCommentContent('');
  };

  const checkEmpty = () => {
    if (commentContent === '') {
      return true;
    } else {
      return false;
    }
  };

  const memoizedComponent = useMemo(
    () => (
      <MyPostDetail
        handleData={handleData}
        post={PostProps.post}
        userInfo={PostProps.userInfo}
        data={data}
        isShared={PostProps.isShared}
        ownerInfo={PostProps.ownerInfo}
      />
    ),
    [PostProps.post, PostProps.userInfo, data]
  );

  const memoizedInputComment = useMemo(
    () => (
      <StyleProvider theme={themeColorSet}>
        <div className='commentInput text-right flex items-center'>
          <Avatar className='mr-2' size={40} src={userInfo.user_image} />
          <div className='input w-full'>
            <Input
              ref={inputRef}
              value={commentContent}
              placeholder='Add a Comment'
              onKeyUp={(e) => {
                const cursorPosition = e.currentTarget.selectionStart;
                setCursor(cursorPosition || 0);
              }}
              onClick={(e) => {
                const cursor = e.currentTarget.selectionStart;
                setCursor(cursor || 0);
              }}
              onChange={(e) => {
                setCommentContent(e.currentTarget.value);
                const cursor = e.currentTarget.selectionStart;
                setCursor(cursor || 0);
              }}
              style={{
                borderColor: themeColorSet.colorText3
              }}
              onPressEnter={handleSubmitComment}
              maxLength={150}
              addonAfter={
                <Popover
                  placement='right'
                  trigger='click'
                  title={'Emoji'}
                  content={
                    <Picker
                      data={async () => {
                        const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

                        return response.json();
                      }}
                      onEmojiSelect={(emoji: any) => {
                        setCursor(cursor + emoji.native.length);
                        setCommentContent(
                          commentContent.slice(0, cursor) + emoji.native + commentContent.slice(cursor)
                        );
                      }}
                    />
                  }>
                  <span
                    className='emoji cursor-pointer hover:text-blue-700'
                    style={{
                      transition: 'all 0.3s'
                    }}>
                    <FontAwesomeIcon className='item mr-3 ml-3' size='lg' icon={faFaceSmile} />
                  </span>
                </Popover>
              }
              suffix={
                <span
                  className='cursor-pointer hover:text-blue-700'
                  {...(checkEmpty()
                    ? {
                        style: {
                          color: 'gray',
                          cursor: 'not-allowed'
                        }
                      }
                    : { transition: 'all 0.3s' })}
                  onClick={handleSubmitComment}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </span>
              }
            />
          </div>
        </div>
      </StyleProvider>
    ),
    [commentContent, cursor]
  );

  useEffect(() => {
    dispatch(
      openModal({
        title: 'The post of ' + PostProps.userInfo?.name,
        component: memoizedComponent,
        footer: memoizedInputComment,
        type: 'post'
      })
    );
  }, [PostProps.post, PostProps.userInfo, data]);

  useEffect(() => {
    dispatch(setFooter(memoizedInputComment));
  }, [commentContent, cursor]);

  return <></>;
};

export default OpenMyPostDetailModal;
