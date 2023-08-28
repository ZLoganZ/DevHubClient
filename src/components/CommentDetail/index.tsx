import { useState } from "react";
import { Comment } from "@ant-design/compatible";
import { Avatar, Skeleton, Tooltip } from "antd";
import Icon, {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";

import StyleTotal from "@/components/Post/cssPost";
import {
  DISLIKE_COMMENT_POST_SAGA,
  LIKE_COMMENT_POST_SAGA,
} from "@/redux/actionSaga/PostActionSaga";
import { useTheme } from "@/components/ThemeProvider";

interface CommentProps {
  comment: any;
  userInfo: any;
  children?: any;
  onData: (data: any) => void;
  selectedCommentId?: string | null;
  onSelectComment: (commentId: string | null) => void;
  isReply?: boolean;
  postID?: string;
}

const CommentDetail = (Props: CommentProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { getTheme } = useTheme();

  const dispatch = useDispatch();

  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [likes, setLike] = useState<number>(Props.comment?.likes?.length || 0);
  const [dislikes, setDislike] = useState<number>(
    Props.comment?.dislikes?.length || 0
  );
  const [action, setAction] = useState(
    Props.comment?.isLiked || Props.comment?.isDisliked
      ? Props.comment?.isLiked
        ? "liked"
        : "disliked"
      : ""
  );

  const like = () => {
    if (action === "liked") {
      setLike((prev: number) => prev - 1);
      setAction("");
    } else {
      setLike((prev: number) => prev + 1);
      if (action === "disliked") setDislike((prev: any) => prev - 1);
      setAction("liked");
    }
    dispatch(
      LIKE_COMMENT_POST_SAGA({
        idComment: Props.comment._id,
        postID: Props.postID,
      })
    );
  };

  const dislike = () => {
    if (action === "disliked") {
      setDislike((prev: number) => prev - 1);
      setAction("");
    } else {
      setDislike((prev: number) => prev + 1);
      if (action === "liked") setLike((prev: any) => prev - 1);
      setAction("disliked");
    }
    dispatch(
      DISLIKE_COMMENT_POST_SAGA({
        idComment: Props.comment._id,
        postID: Props.postID,
      })
    );
  };

  const setReply = () => {
    const selectedCommentId =
      Props.selectedCommentId === Props.comment._id ? null : Props.comment._id;
    Props.onData({
      isReply: selectedCommentId ? true : false,
      idComment: selectedCommentId,
    });
    Props.onSelectComment(selectedCommentId);
  };

  const actions = [
    <span key="comment-basic-like">
      <Tooltip title="Like">
        <Icon
          type="like"
          component={
            action === "liked"
              ? (LikeFilled as React.ForwardRefExoticComponent<any>)
              : (LikeOutlined as React.ForwardRefExoticComponent<any>)
          }
          onClick={like}
          style={{
            fontSize: "0.9rem",
          }}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: "auto" }}>{likes}</span>
    </span>,
    <span key="comment-basic-dislike">
      <Tooltip title="Dislike">
        <Icon
          type="dislike"
          component={
            action === "disliked"
              ? (DislikeFilled as React.ForwardRefExoticComponent<any>)
              : (DislikeOutlined as React.ForwardRefExoticComponent<any>)
          }
          onClick={dislike}
          style={{
            fontSize: "0.9rem",
          }}
        />
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: "auto" }}>{dislikes}</span>
    </span>,
    {
      ...(Props.isReply ? (
        <></>
      ) : (
        <span
          id="reply"
          key="comment-basic-reply-to"
          onClick={setReply}
          {...(Props.selectedCommentId === Props.comment._id
            ? {
                style: {
                  color: "#1890ff",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                },
              }
            : {
                style: {
                  color: "#D4D4D4A6",
                  fontWeight: "normal",
                  fontSize: "0.9rem",
                },
              })}>
          <span style={{ color: themeColorSet.colorText3 }}>
            {Props.selectedCommentId === Props.comment._id ? "Cancel" : "Reply"}
          </span>
        </span>
      )),
    },
  ];

  return (
      <StyleTotal theme={themeColorSet}>
        {!Props.comment?.user?.username ? (
          <Skeleton avatar paragraph={{ rows: 2 }} active />
        ) : (
          <div className="commentDetail">
            <Comment
              author={
                <div
                  style={{
                    fontWeight: 600,
                    color: themeColorSet.colorText1,
                    fontSize: "0.85rem",
                  }}>
                  {Props.comment?.user?.username}
                </div>
              }
              actions={actions}
              avatar={
                Props.comment?.user?.userImage ? (
                  <Avatar
                    src={Props.comment?.user?.userImage}
                    alt={Props.comment?.user?.username}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon="user"
                    alt={Props.comment?.user?.username}
                  />
                )
              }
              content={<div className="">{Props.comment?.content}</div>}>
              {Props.children}
            </Comment>
          </div>
        )}
      </StyleTotal>
  );
};

export default CommentDetail;
