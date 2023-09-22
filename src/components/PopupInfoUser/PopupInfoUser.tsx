import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, ConfigProvider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faEllipsis,
  faSnowflake
} from '@fortawesome/free-solid-svg-icons';

import { getTheme } from '@/util/functions/ThemeFunction';
import { commonColor } from '@/util/cssVariable';
import { FOLLOW_USER_SAGA } from '@/redux/ActionSaga/UserActionSaga';
import { useAppDispatch, useAppSelector, usePopupInfoData } from '@/hooks';
import { UserInfoType } from '@/types';
import StyleTotal from './cssPopupInfoUser';

interface Props {
  userInfo: UserInfoType;
  userID: string;
}

const PopupInfoUser = ({ userInfo, userID }: Props) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const { isLoadingPopupInfo, popupInfo } = usePopupInfoData(
    userInfo._id,
    userID
  );

  const [isFollowing, setIsFollowing] = useState(userInfo.is_following);

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet} className="flex justify-center">
        <div className="popupInfoUser flex" style={{ width: '95%' }}>
          <NavLink to={`/user/${userInfo._id}`}>
            <div className="popupInfoUser__avatar mr-5 mt-3">
              <Avatar size={70} src={userInfo.user_image} />
            </div>
          </NavLink>
          <div className="popupInfoUser__content">
            <NavLink to={`/user/${userInfo._id}`}>
              <div
                className="name"
                style={{
                  color: themeColorSet.colorText1,
                  fontWeight: 600,
                  fontSize: '1.3rem'
                }}>
                {userInfo.name}
              </div>
            </NavLink>
            <div className="position mt-2">
              <FontAwesomeIcon className="icon" icon={faSnowflake} />
              <span
                style={{ color: themeColorSet.colorText3 }}
                className="ml-2">
                User Interface Architect & Senior Manager UX
              </span>
            </div>
            {isLoadingPopupInfo ? (
              <div className="loadingPopupInfoUser">
                <div className="loadingPopupInfoUser__item"></div>
                <div className="loadingPopupInfoUser__item"></div>
                <div className="loadingPopupInfoUser__item"></div>
                <div className="loadingPopupInfoUser__item"></div>
                <div className="loadingPopupInfoUser__item"></div>
              </div>
            ) : (
              <>
                <div className="follow mt-5">
                  <span className="follower item mr-2">
                    <span className="mr-1">{popupInfo?.followers.length}</span>{' '}
                    {popupInfo?.followers.length! > 1
                      ? 'Followers'
                      : 'Follower'}
                  </span>
                  <span className="following item mr-2">
                    <span className="mr-1">{popupInfo?.following.length}</span>{' '}
                    {popupInfo?.following.length! > 1
                      ? 'Followings'
                      : 'Following'}
                  </span>
                  <span className="post mr-2">
                    <span className="mr-1">{userInfo?.posts?.length || 0}</span>{' '}
                    {userInfo?.posts?.length > 1 ? 'Posts' : 'Post'}
                  </span>
                </div>
                <div className="experience mt-5 mb-5">
                  <div className="item mt-2">
                    <FontAwesomeIcon
                      className="icon mr-2"
                      icon={faBriefcase}
                      style={{ color: commonColor.colorBlue1 }}
                    />
                    <span className="company mr-2">Rabiloo</span>
                    <span className="position mr-2">Java Developer</span>
                  </div>
                  <div className="item mt-2">
                    <FontAwesomeIcon
                      className="icon mr-2"
                      icon={faBriefcase}
                      style={{ color: commonColor.colorBlue1 }}
                    />
                    <span className="company mr-2">Pan United</span>
                    <span className="position mr-2">Software Engineer</span>
                  </div>
                </div>
                {userID !== userInfo._id ? (
                  <div className="button_Total flex mb-5">
                    <div className="followButton mr-4">
                      <button
                        className="btnFollow btn-primary px-6 py-1.5 rounded-3xl"
                        onClick={() => {
                          dispatch(FOLLOW_USER_SAGA(userInfo._id));
                          setIsFollowing(!isFollowing);
                        }}>
                        <span style={{ color: commonColor.colorWhile1 }}>
                          {isFollowing ? 'Following' : 'Follow'}
                        </span>
                      </button>
                    </div>
                    <div className="optionButton ">
                      <button className="btnOption btn-primary px-3 py-1.5 text-center rounded-lg">
                        <FontAwesomeIcon className="icon" icon={faEllipsis} />
                      </button>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </>
            )}
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default PopupInfoUser;
