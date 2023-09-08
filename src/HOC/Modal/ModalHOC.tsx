import { ConfigProvider, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { getTheme } from "@/util/functions/ThemeFunction";
import { closeModal } from "@/redux/Slice/ModalHOCSlice";
import {
  ButtonActiveHover,
  ButtonCancelHover,
} from "@/components/MiniComponent";
import StyleTotal from "./cssModalHOC";

const ModalHOC = () => {
  const dispatch = useDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // Hàm xử lý Modal
  const { visible, ComponentContentModal, footer, title, handleSubmit } =
    useSelector((state: any) => state.modalHOCReducer);

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
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
                    {" "}
                    <ButtonCancelHover
                      onClick={() => {
                        onClose();
                      }}>
                      Cancel
                    </ButtonCancelHover>
                  </span>

                  <ButtonActiveHover
                    onClick={(e: any) => {
                      handleSubmit(e);
                    }}
                    rounded>
                    Save
                  </ButtonActiveHover>
                </div>
              ) : (
                footer
              )
            }
            // onOk={handleSubmit}
          >
            {ComponentContentModal}
          </Modal>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default ModalHOC;
