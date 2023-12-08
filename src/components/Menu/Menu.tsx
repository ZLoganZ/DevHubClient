import {
  faBookmark,
  faBriefcase,
  faGlobe,
  faHouse,
  faMaximize,
  faPeopleGroup,
  faUser,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import StyleProvider from './cssMenu';

const MenuMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();
  const [key, setKey] = useState('');

  // Hover menu
  const [collapsed, setCollapsed] = useState(true);
  const handleMouseEnter = () => {
    setCollapsed(false);
    if (isMdScreen) {
      setShowMenu(true);
    }
  };
  const handleMouseLeave = () => {
    if (isMdScreen) {
      setShowMenu(false);
      return;
    }
    setCollapsed(true);
  };

  useEffect(() => {
    const path = location.pathname;
    const pathMap: Record<string, string> = {
      '/': '1',
      '/me': '2',
      [`/user/${currentUserInfo._id}`]: '2',
      '/explore': '3',
      '/collaboration': '4',
      '/work': '5',
      '/bookmark': '6',
      '/community': '7'
    };
    setKey(pathMap[path] ?? '');
  }, [location.pathname]);

  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  const isMdScreen = useMediaQuery({ maxWidth: 1023 });
  useEffect(() => {
    if (isMdScreen) {
      setShowMenu(false);
      setCollapsed(false);
    } else {
      setShowMenu(true);
      setCollapsed(true);
    }
  }, [isMdScreen]);

  return (
    <StyleProvider theme={themeColorSet}>
      <div
        className={isMdScreen ? 'showMenuButton text-3xl' : 'hidden'}
        onClick={handleShowMenu}
        style={{
          color: themeColorSet.colorText1,
          position: 'fixed',
          left: 10,
          top: 20,
          zIndex: 1000
        }}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        className={showMenu ? 'sider' : 'hidden'}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 80,
          bottom: 0,
          zIndex: 1000
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <Menu
          mode='inline'
          selectedKeys={[key]}
          style={{ borderInlineEnd: 'none', backgroundColor: themeColorSet.colorBg1 }}
          className='min-h-full max-h-fit'
          items={[
            {
              key: '1',
              icon: <FontAwesomeIcon className='icon' icon={faHouse} />,
              label: 'Home',
              title: '',
              onClick: () => {
                navigate('/');
                if (isMdScreen) setShowMenu(false);
              }
            },
            {
              key: '2',
              icon: currentUserInfo.user_image ? (
                <img
                  className='icon h-4 w-4 rounded-full overflow-hidden'
                  src={getImageURL(currentUserInfo.user_image, 'avatar_mini')}
                />
              ) : (
                <FontAwesomeIcon className='icon' icon={faUser} />
              ),
              label: currentUserInfo.name,
              title: '',
              onClick: () => {
                navigate(`/user/${currentUserInfo._id}`);
                if (isMdScreen) setShowMenu(false);
              }
            },
            {
              key: '3',
              icon: <FontAwesomeIcon className='icon' icon={faMaximize} />,
              label: 'Explore',
              title: ''
            },
            {
              key: '4',
              icon: <FontAwesomeIcon className='icon' icon={faGlobe} />,
              label: 'Collaborations',
              title: ''
            },
            {
              key: '5',
              icon: <FontAwesomeIcon className='icon' icon={faBriefcase} />,
              label: 'Works',
              title: ''
            },
            {
              key: '6',
              icon: <FontAwesomeIcon className='icon' icon={faBookmark} />,
              label: 'Bookmarks',
              title: '',
              onClick: () => {
                navigate(`/bookmark`);
                if (isMdScreen) setShowMenu(false);
              }
            },
            {
              key: '7',
              icon: <FontAwesomeIcon className='icon' icon={faPeopleGroup} />,
              label: 'All Communities',
              title: ''
            },
            {
              type: 'divider',
              style: {
                backgroundColor: themeColorSet.colorBgReverse4,
                height: '1px'
              }
            },
            {
              key: '8',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/javascript.png' />,
              label: 'Javascript',
              title: ''
            },
            {
              key: '9',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/graphQL.png' />,
              label: 'GraphQL',
              title: ''
            },
            {
              key: '10',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/git.png' />,
              label: 'Git',
              title: ''
            },
            {
              key: '11',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/github.png' />,
              label: 'Github',
              title: ''
            },

            {
              key: '12',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/python.png' />,
              label: 'Python',
              title: ''
            },
            {
              key: '13',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/reactjs.png' />,
              label: 'React',
              title: ''
            },
            {
              key: '14',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/python.png' />,
              label: 'Python',
              title: ''
            },
            {
              key: '15',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/reactjs.png' />,
              label: 'React',
              title: ''
            },
            {
              key: '16',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/python.png' />,
              label: 'Python',
              title: ''
            },
            {
              key: '17',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/reactjs.png' />,
              label: 'React',
              title: ''
            },
            {
              key: '18',
              icon: <img className='h-4 w-4' src='/images/MainLayout/Sider/reactjs.png' />,
              label: 'React',
              title: ''
            }
          ]}
        />
      </Layout.Sider>
    </StyleProvider>
  );
};

export default MenuMain;
