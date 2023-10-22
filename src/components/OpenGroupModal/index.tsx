import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { messageService } from '@/services/MessageService';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import GroupChatModal from '@/components/ChatComponents/GroupChatModal';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { ConversationType, UserInfoType } from '@/types';
import { NEW_CONVERSATION } from '@/util/constants/SettingSystem';

interface Props {
  users: UserInfoType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
}

const OpenGroupModal: React.FC<Props> = ({ users, setConversations }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [membersGroup, SetMembersGroup] = useState<string[]>([]);
  const [name, setGroupName] = useState<string>('');

  const onSubmit = useCallback(() => {
    if (!name || !membersGroup || membersGroup.length < 2) {
      return;
    }

    setIsLoading(true);

    messageService
      .createConversation({ members: membersGroup, name, type: 'group' })
      .then((res) => {
        setIsLoading(false);

        chatSocket.emit(NEW_CONVERSATION, res.data.metadata);

        setConversations((old) => {
          if (!old) return [res.data.metadata];

          const index = old.findIndex((item) => item._id === res.data.metadata._id);
          if (index !== -1) {
            old[index].updatedAt = res.data.metadata.updatedAt;
            old.sort((a, b) => {
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
          } else {
            old.unshift(res.data.metadata);
          }

          return [...old];
        });

        queryClient.setQueryData<ConversationType[]>(['conversations'], (old) => {
          if (!old) return [res.data.metadata];

          const index = old.findIndex((item) => item._id === res.data.metadata._id);
          if (index !== -1) {
            old[index].updatedAt = res.data.metadata.updatedAt;
            old.sort((a, b) => {
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
          } else {
            old.unshift(res.data.metadata);
          }

          return [...old];
        });

        dispatch(closeModal());

        navigate(`/message/${res.data.metadata._id}`);
      })
      .catch(() => console.log('error'))
      .finally(() => {
        setIsLoading(false);
      });
  }, [name, membersGroup]);

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Create a new group chat',
        component: <GroupChatModal setName={setGroupName} setValue={SetMembersGroup} users={users} />,
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
