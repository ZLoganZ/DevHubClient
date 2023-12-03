import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import getImageURL from '@/util/getImageURL';
import { Socket } from '@/util/constants/SettingSystem';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { useSendMessage } from '@/hooks/mutation';
import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import AvatarGroupModal from '@/components/ChatComponents/Modal/AvatarGroup';
import { messageService } from '@/services/MessageService';
import { IMessage } from '@/types';

interface IChangeAvatarGroup {
  conversationID: string;
  image?: string;
}

const ChangeAvatarGroup: React.FC<IChangeAvatarGroup> = ({ image, conversationID }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();
  const { mutateSendMessage } = useSendMessage();

  const [avatar, setAvatar] = useState(
    getImageURL(image, 'avatar') ?? '/images/DefaultAvatar/Empty_Group_Image.png'
  );
  const [fileAvatar, setFileAvatar] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const isChanged = useMemo(() => {
    return !fileAvatar;
  }, [fileAvatar]);

  const handleChangeAvatar = useCallback((file: File) => {
    setFileAvatar(file);
    setAvatar(URL.createObjectURL(file));
  }, []);

  const onSubmit = useCallback(() => {
    setIsLoading(true);

    messageService
      .changeConversationImage(conversationID, fileAvatar!)
      .then((res) => {
        setIsLoading(false);
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
          content: 'changed the group photo',
          createdAt: new Date()
        };

        dispatch(closeModal());
        mutateSendMessage(message as unknown as IMessage);
        chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });

        chatSocket.emit(Socket.CHANGE_CONVERSATION_IMAGE, res.data.metadata);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [fileAvatar]);

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Change group image',
        component: <AvatarGroupModal avatar={avatar} setAvatar={handleChangeAvatar} />,
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover onClick={() => dispatch(closeModal())} disabled={isLoading}>
              Cancel
            </ButtonCancelHover>
            <ButtonActiveHover loading={isLoading} disabled={isChanged} onClick={onSubmit}>
              Change
            </ButtonActiveHover>
          </div>
        )
      })
    );
  }, [avatar, fileAvatar, isLoading]);

  return <></>;
};

export default ChangeAvatarGroup;
