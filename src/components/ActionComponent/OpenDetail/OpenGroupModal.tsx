import { useState, useLayoutEffect } from 'react';

import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { messageService } from '@/services/MessageService';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import GroupChatModal from '@/components/ChatComponents/GroupChatModal';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';

interface Props {
  users: UserInfoType[];
}

const OpenGroupModal = (Props: Props) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const [isLoading, setIsLoading] = useState(false);

  const [membersGroup, SetMembersGroup] = useState<UserInfoType[]>();
  const [name, setGroupName] = useState<string>();

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
          <GroupChatModal setName={handleSetName} setValue={handleSetGroupMember} users={Props.users} />
        ),
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
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

  return <></>;
};

export default OpenGroupModal;
