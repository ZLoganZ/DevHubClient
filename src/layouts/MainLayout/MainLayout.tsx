import { Content } from 'antd/es/layout/layout';
import { useLayoutEffect } from 'react';
import { ConfigProvider, FloatButton, Layout } from 'antd';

import Headers from '@/components/Headers';
import LoadingLogo from '@/components/GlobalSetting/LoadingLogo';
import Menu from '@/components/Menu';
import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppDispatch, useAppSelector, useUserInfo } from '@/hooks';
import StyleTotal from './cssMainLayout';
import { GET_USER_ID } from '@/redux/ActionSaga/AuthActionSaga';

interface PropsMainTemplate {
  Component: () => JSX.Element;
}

const MainLayout = (props: PropsMainTemplate) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  useLayoutEffect(() => {
    dispatch(GET_USER_ID());
  }, []);

  const { isLoadingUserInfo } = useUserInfo();

  if (isLoadingUserInfo) return <LoadingLogo />;

  document.title = 'DevHub';

  const { Component } = props;

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal className="abcdef" theme={themeColorSet}>
        <Layout style={{ backgroundColor: themeColorSet.colorBg1 }}>
          <FloatButton.BackTop />
          <Headers />
          <Menu />
          <Content
            style={{
              marginLeft: '5rem',
              marginTop: '5rem',
              backgroundImage: 'url(/images/ProfilePage/cover.jpg)',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
            <Component />
          </Content>
        </Layout>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default MainLayout;
