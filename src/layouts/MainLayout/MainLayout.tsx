import { Content } from 'antd/es/layout/layout';
import { ConfigProvider, FloatButton, Layout } from 'antd';

import Headers from '@/components/Headers';
import LoadingLogo from '@/components/GlobalSetting/LoadingLogo';
import Menu from '@/components/Menu';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useUserInfo } from '@/hooks/fetch';
import StyleTotal from './cssMainLayout';

interface PropsMainTemplate {
  Component: () => JSX.Element;
}

const MainLayout = (props: PropsMainTemplate) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { isLoadingUserInfo } = useUserInfo();

  document.title = 'DevHub';

  const { Component } = props;

  if (isLoadingUserInfo) return <LoadingLogo />;
  else
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
