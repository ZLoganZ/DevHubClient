import { ConfigProvider } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "@/utils/functions/ThemeFunction";
import StyleTotal from "./cssDrawerHOC";
import { Drawer, Space } from "antd";
import { closeDrawer } from "@/redux/Slice/DrawerHOCSlice";
import {
  ButtonActiveHover,
  ButtonCancelHover,
} from "@/components/MiniComponent";

const DrawerHOC = () => {
  const dispatch = useDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // Hàm xử lý Drawer
  const { visible, ComponentContentDrawer, callBackSubmit, title, loading } =
    useSelector((state: any) => state.drawerHOCReducer);

  const onClose = () => {
    dispatch(closeDrawer({}));
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <StyleTotal theme={themeColorSet}>
        <div>
          <Drawer
            title={title}
            width={720}
            onClose={onClose}
            open={visible}
            footer={
              <div style={{ textAlign: "right" }}>
                <Space>
                  <ButtonCancelHover onClick={onClose} disabled={loading}>
                    Cancel
                  </ButtonCancelHover>
                  <ButtonActiveHover
                    onClick={() => {
                      callBackSubmit();
                    }}
                    loading={loading}
                    rounded>
                    Submit
                  </ButtonActiveHover>
                </Space>
              </div>
            }>
            {ComponentContentDrawer}
          </Drawer>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default DrawerHOC;
