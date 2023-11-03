import { ConfigProvider, FloatButton, Layout } from 'antd';

import Headers from '@/components/Headers';
import LoadingLogo from '@/components/Loading/LoadingLogo';
import Menu from '@/components/Menu';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import StyleProvider from './cssMainLayout';

interface IMainTemplate {
  Component: React.ReactNode;
}

const MainLayout = ({ Component }: IMainTemplate) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColor, themeColorSet } = getTheme();

  const { isLoadingCurrentUserInfo } = useCurrentUserInfo();

  if (isLoadingCurrentUserInfo) return <LoadingLogo />;

  document.title = 'DevHub';

  if (isLoadingCurrentUserInfo) return <LoadingLogo />;

  return (
    <ConfigProvider theme={{ token: themeColor }}>
      <StyleProvider className='abcdef' theme={themeColorSet}>
        <Layout>
          <Headers />
          <Layout>
            <Menu />
            <Layout>
              <FloatButton.BackTop />
              <Layout.Content className='xs:ml-0 ml-20'>{Component}</Layout.Content>
            </Layout>
          </Layout>
        </Layout>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default MainLayout;
