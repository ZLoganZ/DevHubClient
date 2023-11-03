import { useEffect, useMemo, useState } from 'react';

import getImageURL from '@/util/getImageURL';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { closeModal, openModal } from '@/redux/Slice/ModalHOCSlice';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import AvatarGroupModal from '../AvatarGroupModal';

interface IChangeAvatarGroup {
  image?: string;
}

const ChangeAvatarGroup: React.FC<IChangeAvatarGroup> = ({ image }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);

  const [avatar, setAvatar] = useState(
    getImageURL(image, 'avatar') ?? '/images/DefaultAvatar/Empty_Group_Image.png'
  );
  const [fileAvatar, setFileAvatar] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const isChanged = useMemo(() => {
    return !fileAvatar;
  }, [fileAvatar]);

  const handleChangeAvatar = (file: File) => {
    setFileAvatar(file);
    setAvatar(URL.createObjectURL(file));
  };

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(closeModal());
    }, 3000);
  };

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
            <ButtonActiveHover rounded loading={isLoading} disabled={isChanged} onClick={onSubmit}>
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
