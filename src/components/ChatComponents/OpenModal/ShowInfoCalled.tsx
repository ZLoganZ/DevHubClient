import { ButtonCancelHover } from '@/components/MiniComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { IUserInfo } from '@/types';
import { useEffect } from 'react';

interface IAddMemberModal {
  users: IUserInfo[];
  conversationID: string;
}

const ShowInfoCalled: React.FC<IAddMemberModal> = ({ users, conversationID }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);

  useEffect(() => {
    dispatch(
      openModal({
        title: 'Select members to add to the group',
        component: <></>,
        footer: (
          <div className='mt-6 flex items-center justify-end gap-x-3'>
            <ButtonCancelHover onClick={() => dispatch(closeModal())}>Cancel</ButtonCancelHover>
          </div>
        )
      })
    );
  }, []);
  return <></>;
};

export default ShowInfoCalled;
