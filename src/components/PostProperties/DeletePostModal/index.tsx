import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, notification } from 'antd';

import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { useDeletePost } from '@/hooks/mutation';
import { commonColor } from '@/util/cssVariable';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface DeleteModalProps {
  isOpen: boolean;
  postID: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  image?: string[];
}

const DeletePostModal: React.FC<DeleteModalProps> = ({ postID, isOpen, setIsOpen, image }) => {
  const { isLoadingDeletePost, mutateDeletePost } = useDeletePost();

  const handleOk = async () => {
    // if (image) await handleRemoveImage(image);

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
