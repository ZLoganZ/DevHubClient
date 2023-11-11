import { useState, useCallback, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { messageService } from '@/services/MessageService';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { IUserInfo } from '@/types';
import { Socket } from '@/util/constants/SettingSystem';
import MemberToGroup from '../Modal/MemberToGroup';
import { useCurrentUserInfo } from '@/hooks/fetch';

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

  const [isLoading, setIsLoading] = useState(false);

  const [membersGroup, SetMembersGroup] = useState<IUserInfo[]>([]);

  const isChanged = useMemo(() => {
    return membersGroup.length === 0;
  }, [membersGroup]);

  useEffect(() => {
    console.log("member",membersGroup)
  }, [membersGroup]);

  const onSubmit = useCallback(() => {
    setIsLoading(true);

    messageService
      .addMember(
        conversationID,
        membersGroup.map((user) => user._id)
      )
      .then((res) => {
        membersGroup.forEach((user) => {
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
            content: `added ${user.name} to the group`,
            createdAt: new Date()
          };
          chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
        });
        dispatch(closeModal());

        chatSocket.emit(Socket.ADD_MEMBER, res.data.metadata);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [name, membersGroup]);

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Select members to add to the group',
        component: <MemberToGroup users={users} setUsers={SetMembersGroup} />,
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
  }, [isLoading, name, membersGroup]);

  return <></>;
};

export default AddMemberToGroup;
