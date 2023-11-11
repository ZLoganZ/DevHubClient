import { useState, useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { messageService } from '@/services/MessageService';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import MemberToGroup from '@/components/ChatComponents/Modal/MemberToGroup';
import { IMessage, IUserInfo } from '@/types';
import { Socket } from '@/util/constants/SettingSystem';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { useSendMessage } from '@/hooks/mutation';

interface IAddMemberModal {
  users: IUserInfo[];
  conversationID: string;
}

const AddMemberToGroup: React.FC<IAddMemberModal> = ({ users, conversationID }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();
  const { mutateSendMessage } = useSendMessage();

  const [isLoading, setIsLoading] = useState(false);

  const [membersToAdd, SetMembersToAdd] = useState<IUserInfo[]>([]);

  const isChanged = useMemo(() => {
    return membersToAdd.length === 0;
  }, [membersToAdd]);

  const onSubmit = useCallback(() => {
    setIsLoading(true);

    messageService
      .addMember(
        conversationID,
        membersToAdd.map((member) => member._id)
      )
      .then((res) => {
        membersToAdd.forEach((member) => {
          const message = {
            _id: uuidv4().replace(/-/g, ''),
            conversation_id: conversationID,
            sender: {
              _id: currentUserInfo._id,
              user_image: currentUserInfo.user_image,
              name: currentUserInfo.name
            },
            isSending: true,
            type: 'notification',
            content: `added ${member.name} to the group`,
            createdAt: new Date()
          };

          mutateSendMessage(message as unknown as IMessage);
          chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
        });
        dispatch(closeModal());

        chatSocket.emit(Socket.ADD_MEMBER, res.data.metadata);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [membersToAdd]);

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Select members to add to the group',
        component: <MemberToGroup users={users} setMembers={SetMembersToAdd} />,
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover onClick={() => dispatch(closeModal())} disabled={isLoading}>
              Cancel
            </ButtonCancelHover>
            <ButtonActiveHover disabled={isChanged} rounded loading={isLoading} onClick={onSubmit}>
              Add
            </ButtonActiveHover>
          </div>
        )
      })
    );
  }, [isLoading, isChanged, membersToAdd]);

  return <></>;
};

export default AddMemberToGroup;
