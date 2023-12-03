import { Avatar, Popover } from 'antd';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUserGroup, faLock } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';

import PopupInfoUser from '@/components/PopupInfoUser';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { useAppSelector } from '@/hooks/special';
import { IUserInfo, Visibility } from '@/types';
import StyleProvider from './cssPostUserInfo';

interface IUserInfoPostProps {
  userInfo: IUserInfo;
  postID: string;
  visibility: Visibility;
  date: string;
}

const UserInfoPost: React.FC<IUserInfoPostProps> = ({ userInfo, postID, date, visibility }) => {
  const { themeColorSet } = getTheme();

  const isXsScreen = useMediaQuery({ maxWidth: 639 });
  const userID = useAppSelector((state) => state.auth.userID);

  const icon =
    visibility === 'public'
      ? faGlobe
      : visibility === 'member' || visibility === 'friend'
      ? faUserGroup
      : faLock;

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='name_avatar flex'>
        <Avatar size={isXsScreen ? 40 : 50} src={getImageURL(userInfo.user_image, 'avatar_mini')} />
        <div className='name ml-2'>
          <Popover
            overlayInnerStyle={{
              border: `1px solid ${themeColorSet.colorBg3}`
            }}
            mouseEnterDelay={0.4}
            content={<PopupInfoUser userInfo={userInfo} userID={userID} />}>
            <div className='name__top font-bold'>
              <NavLink to={`/user/${userInfo._id}`} style={{ color: themeColorSet.colorText1 }}>
                {userInfo.name}
              </NavLink>
            </div>
          </Popover>
          <div className='time flex items-center gap-2' style={{ color: themeColorSet.colorText3 }}>
            <NavLink to={`/post/${postID}`} style={{ color: themeColorSet.colorText3 }}>
              <span>{date}</span>
            </NavLink>
            <FontAwesomeIcon icon={icon} />
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default UserInfoPost;
