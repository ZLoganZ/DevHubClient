import { ConfigProvider, Skeleton } from 'antd';

import { getTheme } from '@/util/theme';
import StyleTotal from './cssLoadingDetailPost';
import { useAppSelector } from '@/hooks/special';

const LoadingDetailPost = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div
          className="loadingPostDetail px-4 py-3"
          style={{
            maxHeight: '78vh',
            overflow: 'auto'
          }}>
          <div className="header w-1/4">
            <Skeleton active avatar paragraph={{ rows: 1 }} />
          </div>
          <div className="body mt-8">
            <Skeleton className="mb-6" active paragraph={{ rows: 2 }} />
            <Skeleton className="mb-6" active paragraph={{ rows: 2 }} />
          </div>
          <div className="footer w-3/5">
            <Skeleton className="mb-6" active avatar paragraph={{ rows: 1 }} />
            <Skeleton className="mb-6" active avatar paragraph={{ rows: 1 }} />
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default LoadingDetailPost;
