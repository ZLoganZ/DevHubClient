import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, notification } from 'antd';
import { sha1 } from 'crypto-hash';

import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { useDeletePost } from '@/hooks/mutation';
import { commonColor } from '@/util/cssVariable';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface DeleteModalProps {
  isOpen: boolean;
  postID: string;
  setIsOpen: (isOpen: boolean) => void;
  image?: string;
}

const DeletePostModal: React.FC<DeleteModalProps> = ({ postID, isOpen, setIsOpen, image }) => {
  const { isLoadingDeletePost, mutateDeletePost } = useDeletePost();

  const handleRemoveImage = async (imageURL: string) => {
    const nameSplit = imageURL.split('/');
    const duplicateName = nameSplit.pop();

    // Remove .
    const public_id = duplicateName?.split('.').slice(0, -1).join('.');

    const formData = new FormData();
    formData.append('api_key', '235531261932754');
    formData.append('public_id', public_id!);
    const timestamp = String(Date.now());
    formData.append('timestamp', timestamp);
    const signature = await sha1(`public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`);
    formData.append('signature', signature);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return {
      url: data,
      status: 'done'
    };
  };

  const handleOk = async () => {
    if (image) await handleRemoveImage(image);

    mutateDeletePost(postID);

    setIsOpen(false);
    openNotificationWithIcon('success');
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // Notification delete post
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Delete Successfully',
      placement: 'bottomRight'
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <>
            <FontAwesomeIcon
              className='icon mr-2'
              icon={faTriangleExclamation}
              style={{ color: commonColor.colorWarning1 }}
            />
            <span>Are you sure delete this post?</span>
          </>
        }
        open={isOpen}
        onCancel={handleCancel}
        footer={
          <div className='flex justify-end'>
            <ButtonCancelHover
              className='mr-4'
              disabled={isLoadingDeletePost}
              onClick={() => {
                handleCancel();
              }}>
              Cancel
            </ButtonCancelHover>

            <ButtonActiveHover
              loading={isLoadingDeletePost}
              onClick={() => {
                handleOk();
              }}
              rounded>
              Delete
            </ButtonActiveHover>
          </div>
        }>
        <p>You will not be able to recover the post after deleted!</p>
      </Modal>
    </>
  );
};

export default DeletePostModal;
