import { ConfigProvider } from "antd";
import React, { useState, useLayoutEffect } from "react";
import { messageService } from "@/services/MessageService";
import { useDispatch, useSelector } from "react-redux";
import GroupChatModal from "@/components/ChatComponent/GroupChatModal";
import { closeModal, openModal } from "@/redux/Slice/ModalHOCSlice";
import StyleTotal from "./cssOpenPostDetailModal";
import { getTheme } from "@/utils/ThemeFunction";
import {
  ButtonActiveHover,
  ButtonCancelHover,
} from "@/components/MiniComponent";

interface Props {
  users: [];
}

const OpenGroupModal = (Props: Props) => {
  const dispatch = useDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [isLoading, setIsLoading] = useState(false);

  let [membersGroup, SetMembersGroup] = useState<any>();
  let [name, setGroupName] = useState<any>();

  const handleSetName = (newName: any) => {
    setGroupName(() => {
      name = newName;
    });
  };

  const handleSetGroupMember = (newMembers: any) => {
    SetMembersGroup(() => {
      membersGroup = newMembers;
    });
  };

  const onSubmit = () => {
    if (!name || !membersGroup || membersGroup.length < 2) {
      return;
    }

    setIsLoading(true);

    messageService
      .createConversation({ users: membersGroup, name, isGroup: true })
      .then(() => {
        setIsLoading(false);
        dispatch(closeModal());
      })
      .catch(() => console.log("error"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useLayoutEffect(() => {
    dispatch(
      openModal({
        title: "Create a new group chat",
        component: (
          <GroupChatModal
            setName={handleSetName}
            setValue={handleSetGroupMember}
            users={Props.users}
          />
        ),
        footer: (
          <div className="mt-6 flex items-center justify-end gap-x-3">
            <ButtonCancelHover
              onClick={() => {
                dispatch(closeModal());
              }}
              disabled={isLoading}>
              Cancel
            </ButtonCancelHover>
            <ButtonActiveHover rounded loading={isLoading} onClick={onSubmit}>
              Create
            </ButtonActiveHover>
          </div>
        ),
      })
    );
  }, [isLoading, name, membersGroup]);

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <StyleTotal theme={themeColorSet}>
        <div></div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default OpenGroupModal;
