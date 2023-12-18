import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faEllipsis, faSnowflake } from '@fortawesome/free-solid-svg-icons';

import { ButtonActiveHover, ButtonCancelHover } from '@/components/MiniComponent';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import getImageURL from '@/util/getImageURL';
import { useAppSelector } from '@/hooks/special';
import {
  useAcceptFriendUser,
  useAddFriendUser,
  useCancelFriendUser,
  useDeclineFriendUser,
  useDeleteFriendUser
} from '@/hooks/mutation';
import { IUserInfo } from '@/types';
import StyleProvider from './cssPopupInfoUser';
import merge from '@/util/mergeClassName';
import { useCurrentUserInfo } from '@/hooks/fetch';

interface IPopUp {
  userInfo: IUserInfo;
  userID: string;
}

const PopupInfoUser: React.FC<IPopUp> = ({ userInfo, userID }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { mutateAddFriendUser, isLoadingAddFriendUser } = useAddFriendUser();

  const { mutateAcceptFriendUser, isLoadingAcceptFriendUser } = useAcceptFriendUser();

  const { mutateCancelFriendUser, isLoadingCancelFriendUser } = useCancelFriendUser();

  const { mutateDeclineFriendUser, isLoadingDeclineFriendUser } = useDeclineFriendUser();

  const { mutateDeleteFriendUser, isLoadingDeleteFriendUser } = useDeleteFriendUser();

  const { currentUserInfo } = useCurrentUserInfo();

  const sentRequest = useMemo(() => {
    if (currentUserInfo && userInfo) {
      return currentUserInfo.requestSent.indexOf(userInfo._id) !== -1;
    }
    return false;
  }, [currentUserInfo, userInfo]);

  const receivedRequest = useMemo(() => {
    if (currentUserInfo && userInfo) {
      return currentUserInfo.requestReceived.indexOf(userInfo._id) !== -1;
    }
    return false;
  }, [currentUserInfo, userInfo]);

  const [isFriend, setIsFriend] = useState(userInfo?.is_friend);
  useEffect(() => {
    setIsFriend(userInfo?.is_friend);
  }, [userInfo]);

  console.log(isFriend, userID, userInfo);
  return (
    <StyleProvider theme={themeColorSet} className='flex justify-center'>
      <div className='popupInfoUser flex' style={{ width: '95%' }}>
        <NavLink to={`/user/${userInfo._id}`}>
          <div className='popupInfoUser__avatar mr-5 mt-3'>
            <Avatar size={70} src={getImageURL(userInfo.user_image, 'avatar_mini')} />
          </div>
        </NavLink>
        <div className='popupInfoUser__content'>
          <NavLink to={`/user/${userInfo._id}`}>
            <div
              className='name'
              style={{
                color: themeColorSet.colorText1,
                fontWeight: 600,
                fontSize: '1.3rem'
              }}>
              {userInfo.name}
            </div>
          </NavLink>
          <div className='position mt-2'>
            <FontAwesomeIcon className='icon' icon={faSnowflake} />
            <span style={{ color: themeColorSet.colorText3 }} className='ml-2'>
              User Interface Architect & Senior Manager UX
            </span>
          </div>

          <div className='follow mt-5'>
            <span className='follower item mr-2'>
              <span className='mr-1'>{userInfo?.friend_number ?? 0}</span>&nbsp;
              {userInfo?.friend_number > 1 ? 'Friends' : 'Friend'}
            </span>
            {/* <span className='following item mr-2'>
              <span className='mr-1'>{userInfo?.pendingFriend_number ?? 0}</span>&nbsp;
              {userInfo?.pendingFriend_number > 1 ? 'Followings' : 'Following'}
            </span> */}
            <span className='post mr-2'>
              <span className='mr-1'>{userInfo?.post_number ?? 0}</span>&nbsp;
              {userInfo?.post_number > 1 ? 'Posts' : 'Post'}
            </span>
          </div>
          <div className='experience mt-5 mb-5'>
            <div className='item mt-2'>
              <FontAwesomeIcon
                className='icon mr-2'
                icon={faBriefcase}
                style={{ color: commonColor.colorBlue1 }}
              />
              <span className='company mr-2'>Rabiloo</span>
              <span className='position mr-2'>Java Developer</span>
            </div>
            <div className='item mt-2'>
              <FontAwesomeIcon
                className='icon mr-2'
                icon={faBriefcase}
                style={{ color: commonColor.colorBlue1 }}
              />
              <span className='company mr-2'>Pan United</span>
              <span className='position mr-2'>Software Engineer</span>
            </div>
          </div>
          {userID !== userInfo._id && (
            <div className='button_Total flex mb-5'>
              <div className='followButton mr-4'>
                {/* <ButtonActiveHover
                  className='btnFollow btn-primary px-5 py-1.5 rounded-3xl'
                  loading={isLoadingAddFriendUser}
                  onClick={() => {
                    mutateAddFriendUser(userInfo._id, { onSuccess: () => setIsFriend(!isFriend) });
                  }}>
                  <span style={{ color: commonColor.colorWhite1 }}>
                    {isFriend ? 'Unfriend' : 'Add friend'}
                  </span>
                </ButtonActiveHover> */}
                <ButtonActiveHover
                  className={merge(
                    'follow px-6 h-11 border-2 border-solid',
                    isFriend || sentRequest
                      ? '!bg-red-600 hover:!text-white hover:!border-none'
                      : receivedRequest
                      ? '!bg-green-600 hover:!text-white hover:!border-none'
                      : '!bg-blue-600 hover:!text-white hover:!border-none'
                  )}
                  type='default'
                  loading={
                    isLoadingAddFriendUser ||
                    isLoadingAcceptFriendUser ||
                    isLoadingCancelFriendUser ||
                    isLoadingDeleteFriendUser
                  }
                  onClick={() => {
                    isFriend
                      ? mutateDeleteFriendUser(userInfo._id)
                      : sentRequest
                      ? mutateCancelFriendUser(userInfo._id)
                      : receivedRequest
                      ? mutateAcceptFriendUser(userInfo._id)
                      : mutateAddFriendUser(userInfo._id);
                  }}>
                  <span style={{ color: commonColor.colorWhite1 }}>
                    {isFriend
                      ? 'Unfriend'
                      : sentRequest
                      ? 'Cancel Request'
                      : receivedRequest
                      ? 'Accept'
                      : 'Add Friend'}
                  </span>
                </ButtonActiveHover>
                {receivedRequest && (
                  <ButtonCancelHover
                    className='follow px-6 h-11 border-2 border-solid !bg-red-600 hover:!text-white hover:!border-none'
                    loading={isLoadingDeclineFriendUser}
                    onClick={() => {
                      mutateDeclineFriendUser(userID);
                    }}>
                    Decline
                  </ButtonCancelHover>
                )}
              </div>
              <div className='optionButton '>
                <button className='btnOption btn-primary px-3 py-1.5 text-center rounded-lg'>
                  <FontAwesomeIcon className='icon' icon={faEllipsis} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StyleProvider>
  );
};

export default PopupInfoUser;
