import { Avatar, ConfigProvider, Input, Popover, Row, Col } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';

import LoadingDetailPost from '@/components/GlobalSetting/LoadingDetailPost';
import { getTheme } from '@/util/functions/ThemeFunction';
import OtherPostDetail from '@/components/PostDetail/OtherPostDetail';
import { useAppSelector } from '@/hooks/special';
import { useCommentPost } from '@/hooks/mutation';
import { PostType, UserInfoType, SelectedCommentValues } from '@/types';
import StyleTotal from './cssOpenPostDetail';

interface Props {
  post: PostType;
  userInfo: UserInfoType;
}

const OpenOtherPostDetail = (Props: Props) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.themeReducer.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [commentContent, setCommentContent] = useState('');
  const [cursor, setCursor] = useState(0);

  const [data, setData] = useState<SelectedCommentValues>({
    isReply: false,
    idComment: null
  });

  const { mutateCommentPost } = useCommentPost();

  const inputRef = React.useRef<any>();

  useEffect(() => {
    if (data.isReply) inputRef.current.focus();
  }, [data]);

  const handleData = (data: SelectedCommentValues) => {
    setData(data);
  };

  const handleSubmitComment = () => {
    mutateCommentPost({
      content: commentContent,
      post: Props.post._id,
      type: data.isReply ? 'child' : 'parent',
      parent: data.isReply ? data.idComment! : undefined
    });

    setTimeout(() => {
      setCommentContent('');
    }, 1000);
  };

  const checkEmpty = () => {
    if (commentContent === '') {
      return true;
    } else {
      return false;
    }
  };

  let memoizedComponent: JSX.Element;

  if (Props.post._id) {
    memoizedComponent = useMemo(
      () => (
        <OtherPostDetail
          handleData={handleData}
          post={Props.post}
          userInfo={Props.post.post_attributes.user}
          data={data}
          isShared={Props.post.type === 'Share'}
          ownerInfo={Props.post.post_attributes.owner_post}
        />
      ),
      [Props.post, data]
    );
  } else {
    memoizedComponent = useMemo(
      () => <LoadingDetailPost />,
      [Props.post, data]
    );
  }

  let memoizedInputComment: JSX.Element;

  if (Props.post._id) {
    memoizedInputComment = useMemo(
      () => (
        <div className=" commentInput text-right flex items-center px-4 pb-5 mt-4">
          <Avatar className="mr-2" size={40} src={Props.userInfo.user_image} />
          <div className="input w-full">
            <Input
              ref={inputRef}
              value={commentContent}
              placeholder="Add a Comment"
              // allowClear
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
              onPressEnter={handleSubmitComment}
              style={{
                borderColor: themeColorSet.colorText3
              }}
              maxLength={150}
              addonAfter={
                <Popover
                  placement="right"
                  trigger="click"
                  title={'Emoji'}
                  content={
                    <Picker
                      data={async () => {
                        const response = await fetch(
                          'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
                        );

                        return response.json();
                      }}
                      onEmojiSelect={(emoji: any) => {
                        setCursor(cursor + emoji.native.length);
                        setCommentContent(
                          commentContent.slice(0, cursor) +
                            emoji.native +
                            commentContent.slice(cursor)
                        );
                      }}
                    />
                  }>
                  <span
                    className="emoji cursor-pointer hover:text-blue-700"
                    style={{
                      transition: 'all 0.3s'
                    }}>
                    <FontAwesomeIcon
                      className="item mr-3 ml-3"
                      size="lg"
                      icon={faFaceSmile}
                    />
                  </span>
                </Popover>
              }></Input>
            <span
              className="sendComment cursor-pointer hover:text-blue-700"
              {...(checkEmpty()
                ? {
                    style: {
                      color: 'gray',
                      //hover disabled
                      cursor: 'not-allowed'
                    }
                  }
                : { transition: 'all 0.3s' })}
              onClick={handleSubmitComment}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </span>
          </div>
        </div>
      ),
      [commentContent, cursor]
    );
  } else {
    memoizedInputComment = useMemo(() => <></>, [commentContent]);
  }

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <Row className="py-7">
          <Col offset={3} span={18}>
            <div
              style={{
                backgroundColor: themeColorSet.colorBg2
              }}
              className="rounded-lg">
              {memoizedComponent}
              {memoizedInputComment}
            </div>
          </Col>
        </Row>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default OpenOtherPostDetail;
