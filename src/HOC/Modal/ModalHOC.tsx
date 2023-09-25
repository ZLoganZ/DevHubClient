import { ConfigProvider, Modal } from 'antd';

import { getTheme } from '@/util/theme';
import { closeModal } from '@/redux/Slice/ModalHOCSlice';
import {
  ButtonActiveHover,
  ButtonCancelHover
} from '@/components/MiniComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleTotal from './cssModalHOC';

const ModalHOC = () => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // Hàm xử lý Modal
  const { visible, ComponentContentModal, footer, title, handleSubmit } =
    useAppSelector((state) => state.modalHOC);

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div>
          <Modal
            centered
            title={title}
            width={720}
            onCancel={onClose}
            open={visible}
            footer={
              footer === true ? (
                <div className="flex justify-end">
                  <span className="mr-4">
                    {' '}
                    <ButtonCancelHover
                      onClick={() => {
                        onClose();
                      }}>
                      Cancel
                    </ButtonCancelHover>
                  </span>

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
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default ModalHOC;
