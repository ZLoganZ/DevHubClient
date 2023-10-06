import { ConfigProvider, Modal } from 'antd';

import { getTheme } from '@/util/theme';
import { closeModal } from '@/redux/Slice/ModalHOCSlice';
import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssModalHOC';

const ModalHOC = () => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // Hàm xử lý Modal
  const { visible, ComponentContentModal, footer, title, handleSubmit, type } = useAppSelector(
    (state) => state.modalHOC
  );

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleProvider theme={themeColorSet}>
        <Modal
          key={title}
          centered
          title={title}
          width={type === 'post' ? 1080 : 720}
          onCancel={onClose}
          open={visible}
          bodyStyle={{
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 200px)',
            minHeight: 'calc(100vh - 5rem)'
          }}
          footer={
            footer === true ? (
              <div className='flex justify-end'>
                <ButtonCancelHover
                  className='mr-4'
                  onClick={() => {
                    onClose();
                  }}>
                  Cancel
                </ButtonCancelHover>

                <ButtonActiveHover
                  onClick={() => {
                    handleSubmit();
                  }}
                  rounded>
                  Save
                </ButtonActiveHover>
              </div>
            ) : (
              footer
            )
          }>
          {ComponentContentModal}
        </Modal>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default ModalHOC;
