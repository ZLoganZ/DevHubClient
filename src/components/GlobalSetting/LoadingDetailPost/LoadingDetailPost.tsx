import { ConfigProvider, Skeleton } from 'antd';
import { useSelector } from 'react-redux';

import { getTheme } from '@/util/functions/ThemeFunction';
import StyleTotal from './cssLoadingDetailPost';
import { RootState } from '@/redux/configStore';

const LoadingDetailPost = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
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
