import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from 'antd';

import { Socket } from '@/util/constants/SettingSystem';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { messageService } from '@/services/MessageService';
import { getTheme } from '@/util/theme';

interface IChangeGroupName {
  conversationID: string;
  name?: string;
}

const ChangeGroupName: React.FC<IChangeGroupName> = ({ name, conversationID }) => {
  const { themeColorSet } = getTheme();
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();

  const [isLoading, setIsLoading] = useState(false);

  const [nameGroup, setNameGroup] = useState(name);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNameGroup(e.target.value);
  };

  const isChanged = useMemo(() => {
    return nameGroup === name;
  }, [nameGroup]);

  const onSubmit = () => {
    setIsLoading(true);

    messageService
      .changeConversationName(conversationID, nameGroup!)
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
          content: 'changed the group name',
          createdAt: new Date()
        };

        dispatch(closeModal());

        chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });

        chatSocket.emit(Socket.CHANGE_CONVERSATION_NAME, res.data.metadata);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Change group name',
        component: (
          <div className='relative'>
            <Input
              className='pt-6 z-0'
              id='name'
              showCount
              maxLength={30}
              onChange={onChange}
              size='large'
              defaultValue={name}
            />
            <label
              htmlFor='name'
              className='absolute top-1 left-3 z-10 text-xs font-semibold'
              style={{
                color: themeColorSet.colorText2
              }}>
              Type group name
            </label>
          </div>
        ),
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover onClick={() => dispatch(closeModal())} disabled={isLoading}>
              Cancel
            </ButtonCancelHover>
            <ButtonActiveHover rounded loading={isLoading} disabled={isChanged} onClick={onSubmit}>
              Change
            </ButtonActiveHover>
          </div>
        )
      })
    );
  }, [name, isLoading, nameGroup]);

  return <></>;
};

export default ChangeGroupName;
