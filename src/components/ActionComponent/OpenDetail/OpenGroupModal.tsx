import { ConfigProvider } from 'antd';
import { useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StyleTotal from './cssOpenPostDetailModal';
import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { getTheme } from '@/util/functions/ThemeFunction';
import { messageService } from '@/services/MessageService';
import {
  ButtonActiveHover,
  ButtonCancelHover
} from '@/components/MiniComponent';
import GroupChatModal from '@/components/ChatComponents/GroupChatModal';
import { AppDispatch, RootState } from '@/redux/configStore';
import { UserInfoType } from '@/types';

interface Props {
  users: UserInfoType[];
}

const OpenGroupModal = (Props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [isLoading, setIsLoading] = useState(false);

  let [membersGroup, SetMembersGroup] = useState<UserInfoType[]>();
  let [name, setGroupName] = useState<string>();

  const handleSetName = (newName: string) => {
    setGroupName(newName);
  };

  const handleSetGroupMember = (newMembers: []) => {
    SetMembersGroup(newMembers);
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
      .catch(() => console.log('error'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useLayoutEffect(() => {
    dispatch(
      openModal({
        title: 'Create a new group chat',
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
        )
      })
    );
  }, [isLoading, name, membersGroup]);

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div></div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default OpenGroupModal;
