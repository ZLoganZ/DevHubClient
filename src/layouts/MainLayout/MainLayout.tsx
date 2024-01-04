import { ConfigProvider, FloatButton, Layout } from 'antd';

import Headers from '@/components/Headers';
import LoadingLogo from '@/components/Loading/LoadingLogo';
import Menu from '@/components/Menu';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import StyleProvider from './cssMainLayout';

interface IMainLayout {
  Component: React.ReactNode;
}

const MainLayout = ({ Component }: IMainLayout) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColor, themeColorSet } = getTheme();

  const { isLoadingCurrentUserInfo } = useCurrentUserInfo();

  document.title = 'DevHub';

  return (
    <ConfigProvider theme={{ token: themeColor }}>
      {isLoadingCurrentUserInfo ? (
        <LoadingLogo />
      ) : (
        <StyleProvider theme={themeColorSet}>
          <Layout hasSider>
            <Menu />
            <Layout>
              <Headers />
              <FloatButton.BackTop />
              <Layout.Content className='md:ml-0 ml-20'>{Component}</Layout.Content>
            </Layout>
          </Layout>
        </StyleProvider>
      )}
    </ConfigProvider>
  );
};

export default MainLayout;
