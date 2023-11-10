import { useEffect, useRef, useState } from 'react';
import { Avatar, Input, InputRef, Popover } from 'antd';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQuery } from 'react-responsive';
import Picker from '@emoji-mart/react';

import { useAppSelector } from '@/hooks/special';
import { IEmoji, IUserInfo } from '@/types';
import getImageURL from '@/util/getImageURL';
import { getTheme } from '@/util/theme';
import merge from '@/util/mergeClassName';
import { useCommentPost } from '@/hooks/mutation';
import StyleProvider from './cssCommentInput';

interface ICommentInputProps {
  currentUser: IUserInfo;
  postID: string;
}

const CommentInput: React.FC<ICommentInputProps> = ({ currentUser, postID }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { handleCommentInput } = useAppSelector((state) => state.comment);

  const { mutateCommentPost } = useCommentPost();

  const [commentContent, setCommentContent] = useState('');
  const [cursor, setCursor] = useState(0);
  const data = useAppSelector((state) => state.modalHOC.data);

  const isXsScreen = useMediaQuery({ maxWidth: 639 });
  const inputRef = useRef<InputRef | null>(null);

  const checkEmpty = commentContent.trim() === '' || commentContent.trim().length === 0;

  const handleSubmitComment = () => {
    const { isReply, idComment } = data;

    if (checkEmpty) return;

    mutateCommentPost({
      content: commentContent,
      post: postID,
      type: isReply ? 'child' : 'parent',
      parent: isReply ? idComment! : undefined
    });

    // sent commentInput to parent
    handleCommentInput(commentContent);

    setCommentContent('');
  };

  useEffect(() => {
    if (data.isReply) inputRef.current?.focus();
  }, [data]);

  return (
    <StyleProvider>
      <div className='commentInput text-right flex items-center px-4 pb-5 mt-4 xs:px-0'>
        <Avatar className='rounded-full' size={30} src={getImageURL(currentUser.user_image, 'avatar_mini')} />
        <div className='input w-full ml-2'>
          <Input
            ref={inputRef}
            value={commentContent}
            placeholder='Write a comment...'
            allowClear
            onKeyUp={(e) => {
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition ?? 0);
            }}
            onClick={(e) => {
              const cursor = e.currentTarget.selectionStart;
              setCursor(cursor ?? 0);
            }}
            onChange={(e) => {
              setCommentContent(e.currentTarget.value);
              const cursor = e.currentTarget.selectionStart;
              setCursor(cursor ?? 0);
            }}
            onPressEnter={handleSubmitComment}
            style={{
              borderColor: themeColorSet.colorText3
            }}
            maxLength={150}
            addonAfter={
              <Popover
                placement={!isXsScreen ? 'right' : 'top'}
                trigger='click'
                content={
                  <Picker
                    theme={themeColorSet.colorPicker}
                    data={async () => {
                      const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

                      return await response.json();
                    }}
                    onEmojiSelect={(emoji: IEmoji) => {
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
                className={merge(
                  'transition-all duration-300',
                  checkEmpty
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:text-blue-700 hover:scale-110 cursor-pointer'
                )}
                onClick={handleSubmitComment}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
            }
            prefix={
              data.isReply && (
                <div className='flex items-center'>
                  <span className='mr-2'>Reply to</span>
                  <Avatar className='mr-2' size={20} src={getImageURL(data.user_image!, 'avatar_mini')} />
                  <span className='mr-2'>{data.name}</span>
                </div>
              )
            }
          />
        </div>
      </div>
    </StyleProvider>
  );
};

export default CommentInput;
