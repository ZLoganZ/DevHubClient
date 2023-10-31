import { Content } from 'antd/es/layout/layout';
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
  useAppSelector((state) => state.theme.change);
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
              <Content
                className='xs:ml-0 xs:mt-20 ml-20'
                style={{
                  paddingTop: '5rem'
                  // backgroundImage: 'url(/images/TimeLinePage/cover.png)',
                  // backgroundAttachment: 'fixed',
                  // backgroundRepeat: 'no-repeat',
                  // backgroundSize: 'cover',
                  // backgroundPosition: 'center'
                }}>
                {Component}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default MainLayout;
