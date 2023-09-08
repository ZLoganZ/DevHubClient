import { Content } from "antd/es/layout/layout";
import { useLayoutEffect } from "react";
import { ConfigProvider, FloatButton, Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Headers from "@/components/Headers";
import LoadingLogo from "@/components/GlobalSetting/LoadingLogo";
import Menu from "@/components/Menu";
import { GET_USER_INFO_SAGA } from "@/redux/ActionSaga/UserActionSaga";
import { getTheme } from "@/util/functions/ThemeFunction";
import StyleTotal from "./cssMainLayout";

interface PropsMainTemplate {
  Component: () => JSX.Element;
}

const MainLayout = (props: PropsMainTemplate) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userReducer.userInfo);

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useLayoutEffect(() => {
    dispatch(GET_USER_INFO_SAGA());
  }, []);

  if (!userInfo) {
    return <LoadingLogo />;
  }

  document.title = "DevHub";

  const { Component } = props;

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}>
      <StyleTotal className="abcdef" theme={themeColorSet}>
        <Layout style={{ backgroundColor: themeColorSet.colorBg1 }}>
          <FloatButton.BackTop />
          <Headers />
          <Layout hasSider style={{ backgroundColor: themeColorSet.colorBg1 }}>
            <Menu />
            <Content style={{ marginLeft: "5rem", marginTop: "5rem" }}>
              <div
                style={{
                  backgroundImage: "url(/images/ProfilePage/cover.jpg)",
                  backgroundAttachment: "fixed",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <Component />
              </div>
            </Content>
          </Layout>
        </Layout>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default MainLayout;
