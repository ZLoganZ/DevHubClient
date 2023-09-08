import { useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/functions/ThemeFunction';
import StyleTotal from './cssNotFound404';

const NotFound404 = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  document.title = 'Not Found!';

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}
    >
      <StyleTotal theme={themeColorSet}>
        <div className="notFound404">
          <div id="notfound">
            <div className="notfound">
              <div className="notfound-404">
                <h1>404</h1>
                <h2>Page not found</h2>
              </div>
              <NavLink to="/">Homepage</NavLink>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default NotFound404;
