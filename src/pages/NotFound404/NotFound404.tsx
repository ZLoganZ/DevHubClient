import { NavLink } from 'react-router-dom';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import StyleProvider from './cssNotFound404';

const NotFound404 = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  document.title = 'Not Found!';

  return (
    <StyleProvider theme={themeColorSet}>
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
    </StyleProvider>
  );
};

export default NotFound404;
