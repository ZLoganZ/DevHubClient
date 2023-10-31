import { Avatar, Popover } from 'antd';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import PopupInfoUser from '@/components/PopupInfoUser';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import StyleProvider from './cssPostUserInfo';

interface IUserInfoPost {
  userInfo: UserInfoType;
  postID: string;
  date: string;
}

const UserInfoPost: React.FC<IUserInfoPost> = ({ userInfo, postID, date }) => {
  const { themeColorSet } = getTheme();

  const isXsScreen = useMediaQuery({ maxWidth: 639 });
  const userID = useAppSelector((state) => state.auth.userID);

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
          <div className='time' style={{ color: themeColorSet.colorText3 }}>
            <NavLink to={`/post/${postID}`} style={{ color: themeColorSet.colorText3 }}>
              <span>{date}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default UserInfoPost;
