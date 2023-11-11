import { message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { messageService } from '@/services/MessageService';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import GroupChatModal from '@/components/ChatComponents/GroupChatModal';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { IUserInfo } from '@/types';
import { Socket } from '@/util/constants/SettingSystem';
import { useReceiveConversation } from '@/hooks/mutation';

interface IGroupModal {
  users: IUserInfo[];
}

const OpenGroupModal: React.FC<IGroupModal> = ({ users }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { mutateReceiveConversation } = useReceiveConversation();

  const navigate = useNavigate();

  const [messageAPI, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState(false);

  const [membersGroup, SetMembersGroup] = useState<string[]>([]);
  const [name, setGroupName] = useState<string>('');

  const onSubmit = useCallback(() => {
    if (!name || !membersGroup || membersGroup.length < 2) {
      void messageAPI.error('Please enter a group name and select at least 2 members');
      return;
    }

    setIsLoading(true);

    messageService
      .createConversation({ members: membersGroup, name, type: 'group' })
      .then((res) => {
        setIsLoading(false);

        chatSocket.emit(Socket.NEW_CONVERSATION, res.data.metadata);

        mutateReceiveConversation(res.data.metadata);

        dispatch(closeModal());

        navigate(`/message/${res.data.metadata._id}`);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [name, membersGroup]);

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Create a new group chat',
        component: <GroupChatModal setName={setGroupName} setValue={SetMembersGroup} users={users} />,
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover onClick={() => dispatch(closeModal())} disabled={isLoading}>
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

  return <>{contextHolder}</>;
};

export default OpenGroupModal;
