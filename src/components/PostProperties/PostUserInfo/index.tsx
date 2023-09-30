import { Avatar, Popover } from 'antd';
import { NavLink } from 'react-router-dom';

import PopupInfoUser from '@/components/PopupInfoUser';
import StyleProvider from './cssPostUserInfo';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import { useMediaQuery } from 'react-responsive';

interface UserInfoPostProps {
  userInfo: UserInfoType;
  postID: string;
  date: string;
}

const UserInfoPost = (Props: UserInfoPostProps) => {
  const { themeColorSet } = getTheme();

  const userID = useAppSelector((state) => state.auth.userID);
  const isXsScreen = useMediaQuery({ maxWidth: 639 });
  return (
    <StyleProvider theme={themeColorSet}>
      <div className='name_avatar flex'>
        <Avatar size={isXsScreen ? 40 : 50} src={Props.userInfo.user_image} />
        <div className='name ml-2'>
          <Popover
            overlayInnerStyle={{
              border: `1px solid ${themeColorSet.colorBg3}`
            }}
            mouseEnterDelay={0.4}
            content={<PopupInfoUser userInfo={Props.userInfo} userID={userID!} />}>
            <div className='name__top font-bold'>
              <NavLink to={`/user/${Props.userInfo._id}`} style={{ color: themeColorSet.colorText1 }}>
                {Props.userInfo.name}
              </NavLink>
            </div>
          </Popover>
          <div className='time' style={{ color: themeColorSet.colorText3 }}>
            <NavLink to={`/post/${Props.postID}`} style={{ color: themeColorSet.colorText3 }}>
              <span>{Props.date}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default UserInfoPost;
