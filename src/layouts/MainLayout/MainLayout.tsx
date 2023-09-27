import { Content } from 'antd/es/layout/layout';
import { ConfigProvider, FloatButton, Layout } from 'antd';

import Headers from '@/components/Headers';
import LoadingLogo from '@/components/Loading/LoadingLogo';
import Menu from '@/components/Menu';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useUserInfo } from '@/hooks/fetch';
import StyleProvider from './cssMainLayout';

interface PropsMainTemplate {
  Component: () => JSX.Element;
}

const MainLayout = (props: PropsMainTemplate) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor, themeColorSet } = getTheme();

  const { isLoadingUserInfo } = useUserInfo();

  document.title = 'DevHub';

  const { Component } = props;

  if (isLoadingUserInfo) return <LoadingLogo />;

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleProvider className="abcdef" theme={themeColorSet}>
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
      </StyleProvider>
    </ConfigProvider>
  );
};

export default MainLayout;
