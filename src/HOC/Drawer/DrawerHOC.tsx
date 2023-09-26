import { ConfigProvider, Drawer, Space } from 'antd';

import { getTheme } from '@/util/theme';
import { closeDrawer } from '@/redux/Slice/DrawerHOCSlice';
import {
  ButtonActiveHover,
  ButtonCancelHover
} from '@/components/MiniComponent';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleTotal from './cssDrawerHOC';

const DrawerHOC = () => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  // Hàm xử lý Drawer
  const { visible, ComponentContentDrawer, callBackSubmit, title, loading } =
    useAppSelector((state) => state.drawerHOC);

  const onClose = () => {
    dispatch(closeDrawer());
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <Drawer
          title={title}
          width={720}
          onClose={onClose}
          open={visible}
          footer={
            <div style={{ textAlign: 'right' }}>
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
      </StyleTotal>
    </ConfigProvider>
  );
};

export default DrawerHOC;
