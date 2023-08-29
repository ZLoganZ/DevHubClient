import { ConfigProvider, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "@/utils/functions/ThemeFunction";
import StyleTotal from "./cssChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import {
  CommentOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { NavLink, useParams } from "react-router-dom";
import ConversationList from "@/components/ChatComponent/ConversationList";
import EmptyChat from "@/components/ChatComponent/EmptyChat";
import MessageChat from "@/components/ChatComponent/MessageChat";
import {
  useConversationsData,
  useCurrentConversationData,
  useFollowersData,
} from "@/hooks/DataProvider";
import { GET_USER_ID } from "@/redux/actionSaga/AuthActionSaga";
import SharedMedia from "@/components/ChatComponent/SharedMedia";
import LoadingChat from "@/components/GlobalSetting/LoadingChat";
import LoadingConversation from "@/components/GlobalSetting/LoadingConversation";
import InputChat from "@/components/ChatComponent/InputChat";

const Chat = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const dispatch = useDispatch();

  const { conversationID } = useParams();

  const { userID } = useSelector((state: any) => state.authReducer);

  useEffect(() => {
    dispatch(GET_USER_ID());
  }, []);

  const { conversations, isLoadingConversations } = useConversationsData();

  const { followers, isLoadingFollowers } = useFollowersData(userID);

  const { isLoadingConversation } = useCurrentConversationData(
    conversationID ? conversationID : undefined
  );

  const [isDisplayShare, setIsDisplayShare] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <StyleTotal theme={themeColorSet}>
        {isLoadingConversations || isLoadingFollowers ? (
          <LoadingChat />
        ) : (
          <div className="chat flex">
            <div
              className="slider flex flex-col justify-between items-center h-screen py-3"
              style={{
                width: "5%",
                borderRight: "1px solid",
                borderColor: themeColorSet.colorBg4,
                position: "fixed",
                backgroundColor: themeColorSet.colorBg1,
              }}>
              <div className="logo">
                <NavLink to="/" className="icon_logo">
                  <FontAwesomeIcon className="icon" icon={faSnowflake} />
                </NavLink>
              </div>
              <div className="option">
                <Space size={30} direction="vertical">
                  <div className="message optionItem">
                    <CommentOutlined className="text-2xl" />
                  </div>
                  <div className="Search optionItem">
                    <SearchOutlined className="text-2xl" />
                  </div>
                  <div className="Setting optionItem">
                    <SettingOutlined className="text-2xl" />
                  </div>
                </Space>
              </div>
              <div className="mode">
                <FontAwesomeIcon className="icon" icon={faSun} />
              </div>
            </div>
            <div
              className="insteadComponent"
              style={{
                marginLeft: "5%",
                width: "23%",
                height: "100vh",
                position: "fixed",
                borderRight: "1px solid",
                borderColor: themeColorSet.colorBg4,
              }}>
              <ConversationList
                key={conversations[0]?.lastMessageAt}
                users={followers}
                initialItems={conversations}
                selected={conversationID}
              />
            </div>
            <div
              className="chatBox"
              style={{
                width: isDisplayShare ? "49%" : "72%",
                marginLeft: "28%",
                height: "100vh",
                position: "fixed",
                backgroundColor: themeColorSet.colorBg1,
                borderRight: isDisplayShare ? "1px solid" : "none",
                borderColor: themeColorSet.colorBg4,
              }}>
              {!conversationID ? (
                <EmptyChat key={Math.random()} />
              ) : isLoadingConversation ? (
                <LoadingConversation />
              ) : (
                <>
                  <div style={{ height: "92%" }}>
                    <MessageChat
                      // key={conversations[0]?.lastMessageAt}
                      key={conversationID}
                      conversationId={conversationID}
                      setIsDisplayShare={setIsDisplayShare}
                      isDisplayShare={isDisplayShare}
                    />
                  </div>
                  <InputChat conversationID={conversationID} />
                </>
              )}
            </div>
            {isDisplayShare ? (
              <SharedMedia
                key={conversationID}
                conversationId={conversationID}
              />
            ) : (
              <></>
            )}
          </div>
        )}
      </StyleTotal>
    </ConfigProvider>
  );
};

export default Chat;
