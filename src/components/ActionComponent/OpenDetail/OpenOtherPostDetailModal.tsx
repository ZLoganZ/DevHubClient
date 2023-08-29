import { Avatar, ConfigProvider, Input, Popover, Modal } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "@/utils/functions/ThemeFunction";
import OtherPostDetailModal from "@/components/Form/PostDetail/OtherPostDetail";
import StyleTotal from "./cssOpenPostDetailModal";
import dataEmoji from "@emoji-mart/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Picker from "@emoji-mart/react";
import {
  SAVE_COMMENT_POSTSHARE_SAGA,
  SAVE_COMMENT_SAGA,
  SAVE_REPLY_SAGA,
  SAVE_REPLY_POSTSHARE_SAGA,
  GET_POSTSHARE_BY_ID_SAGA,
  GET_POST_BY_ID_SAGA,
} from "@/redux/actionSaga/PostActionSaga";

interface PostProps {
  post: any;
  userInfo: any;
  postShare?: any;
  owner?: any;
  visible?: boolean;
  setVisible?: any;
}

const OpenOtherPostDetailModal = (PostProps: PostProps) => {
  const dispatch = useDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const userInfo = useSelector((state: any) => state.userReducer.userInfo);

  const [commentContent, setCommentContent] = useState("");
  const [cursor, setCursor] = useState(0);

  const [visible, setVisible] = useState(PostProps.visible);

  useEffect(() => {
    if (PostProps.postShare) {
      dispatch(GET_POSTSHARE_BY_ID_SAGA({ id: PostProps.post._id }));
    } else {
      dispatch(GET_POST_BY_ID_SAGA({ id: PostProps.post._id }));
    }
  }, [PostProps.post._id, PostProps.postShare]);

  const [data, setData] = useState<any>({ isReply: false, idComment: null });

  const inputRef = React.useRef<any>(null);

  const handleData = (data: any) => {
    setData(data);
  };

  useEffect(() => {
    if (data.isReply) inputRef.current.focus();
  }, [data]);

  useEffect(() => {
    if (!PostProps.visible) setCommentContent("");
  }, [PostProps.visible]);

  const handleSubmitComment = () => {
    const { postShare, post } = PostProps;
    const { isReply, idComment } = data;
    const comment = {
      contentComment: commentContent,
    };

    const saveCommentAction = postShare
      ? SAVE_COMMENT_POSTSHARE_SAGA
      : SAVE_COMMENT_SAGA;
    const saveReplyAction = postShare
      ? SAVE_REPLY_POSTSHARE_SAGA
      : SAVE_REPLY_SAGA;

    if (isReply) {
      dispatch(
        saveReplyAction({
          id: post?._id,
          reply: {
            contentComment: commentContent,
            idComment,
          },
        })
      );
      setData({ isReply: false, idComment: null });
    } else {
      dispatch(
        saveCommentAction({
          comment,
          id: post?._id,
        })
      );
    }

    setCommentContent("");
  };

  const checkEmpty = () => {
    if (commentContent === "") {
      return true;
    } else {
      return false;
    }
  };

  const memoizedComponent = useMemo(
    () => (
      <OtherPostDetailModal
        onData={handleData}
        post={PostProps.post}
        userInfo={PostProps.userInfo}
        data={data}
        postShare={PostProps.postShare}
        owner={PostProps.owner}
      />
    ),
    [PostProps.post, PostProps.userInfo, data]
  );

  const memoizedInputComment = useMemo(
    () => (
      <div className="commentInput text-right flex items-center">
        <Avatar className="mr-2" size={40} src={userInfo?.userImage} />
        <div className="input w-full">
          <Input
            ref={inputRef}
            value={commentContent}
            placeholder="Add a Comment"
            // allowClear
            onKeyUp={(e) => {
              // get cursor position
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
              borderColor: themeColorSet.colorText3,
            }}
            maxLength={150}
            onPressEnter={handleSubmitComment}
            addonAfter={
              <Popover
                placement="right"
                trigger="click"
                title={"Emoji"}
                content={
                  <Picker
                    data={dataEmoji}
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
                    transition: "all 0.3s",
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
                    color: "gray",
                    cursor: "not-allowed",
                  },
                }
              : { transition: "all 0.3s" })}
            onClick={handleSubmitComment}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </span>
        </div>
      </div>
    ),
    [commentContent, cursor]
  );

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <StyleTotal theme={themeColorSet}>
        <Modal
          centered
          title={"The post of " + PostProps.userInfo?.username}
          width={720}
          footer={
            <ConfigProvider>
              <StyleTotal theme={themeColorSet}>
                {memoizedInputComment}
              </StyleTotal>
            </ConfigProvider>
          }
          open={visible}
          onCancel={() => {
            setVisible(false);
            setTimeout(() => {
              PostProps.setVisible(false);
            }, 300);
          }}>
          {memoizedComponent}
        </Modal>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default OpenOtherPostDetailModal;
