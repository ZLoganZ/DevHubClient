import { Button } from 'antd';

import { getTheme } from '@/util/theme';
import merge from '@/util/mergeClassName';
import { useAppSelector } from '@/hooks/special';
import StyleProvider from './cssMiniComponent';
import { IUserInfo } from '@/types';
import {
  useAcceptFriendUser,
  useAddFriendUser,
  useCancelFriendUser,
  useDeclineFriendUser,
  useDeleteFriendUser
} from '@/hooks/mutation';
import { useEffect, useState } from 'react';
import { useCurrentUserInfo } from '@/hooks/fetch';

// ===========================================

type ButtonNormalHoverType = 'primary' | 'text' | 'default' | 'dashed';

interface IButtonActiveHover {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  loading?: boolean;
  type?: ButtonNormalHoverType;
  style?: React.CSSProperties;
}

export const ButtonActiveHover: React.FC<IButtonActiveHover> = ({
  className,
  children,
  onClick,
  loading,
  disabled,
  style,
  type = 'primary'
}) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        type={type}
        disabled={disabled ?? loading}
        className={merge('ButtonActiveHover h-full w-full font-bold px-6 py-2 rounded-full', className)}
        onClick={onClick}
        loading={loading}
        htmlType='submit'
        style={{ ...style, boxShadow: 'none' }}>
        {children}
      </Button>
    </StyleProvider>
  );
};

// ===========================================

export const ButtonActiveNonHover = () => {
  return <></>;
};

// ===========================================

interface IButtonCancelHover {
  children?: React.ReactNode;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
}

export const ButtonCancelHover: React.FC<IButtonCancelHover> = ({
  className,
  children,
  loading,
  onClick,
  disabled
}) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        className={merge('ButtonCancelHover font-bold px-6 py-2 rounded-3xl', className)}
        loading={loading}
        onClick={onClick}
        style={{ height: '100%' }}
        htmlType='button'
        disabled={disabled}>
        {children}
      </Button>
    </StyleProvider>
  );
};

// ===========================================

export const ButtonCancelNonHover = () => {
  return <></>;
};

// ===========================================

interface IButtonFriend {
  user: IUserInfo;
}
export const ButtonFriend: React.FC<IButtonFriend> = ({ user }) => {
  const { mutateAddFriendUser, isLoadingAddFriendUser } = useAddFriendUser();

  const { mutateAcceptFriendUser, isLoadingAcceptFriendUser } = useAcceptFriendUser();

  const { mutateCancelFriendUser, isLoadingCancelFriendUser } = useCancelFriendUser();

  const { mutateDeclineFriendUser, isLoadingDeclineFriendUser } = useDeclineFriendUser();

  const { mutateDeleteFriendUser, isLoadingDeleteFriendUser } = useDeleteFriendUser();

  const { currentUserInfo } = useCurrentUserInfo();

  const [isFriend, setIsFriend] = useState(false);

  const [sentRequest, setSentRequest] = useState(false);

  const [receivedRequest, setReceivedRequest] = useState(false);

  useEffect(() => {
    setIsFriend(user?.is_friend);
    setSentRequest(currentUserInfo?.requestSent.indexOf(user?._id) !== -1);
    setReceivedRequest(currentUserInfo?.requestReceived.indexOf(user?._id) !== -1);
  }, [user, currentUserInfo]);
  return (
    <>
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
            ? mutateDeleteFriendUser(user._id).then(() => setIsFriend(false))
            : sentRequest
            ? mutateCancelFriendUser(user._id).then(() => setSentRequest(false))
            : receivedRequest
            ? mutateAcceptFriendUser(user._id).then(() => {
                setReceivedRequest(false);
                setIsFriend(true);
              })
            : mutateAddFriendUser(user._id).then(() => setSentRequest(true));
        }}>
        {isFriend ? 'Unfriend' : sentRequest ? 'Cancel Request' : receivedRequest ? 'Accept' : 'Add Friend'}
      </ButtonActiveHover>
      {receivedRequest && (
        <ButtonCancelHover
          className='follow px-6 h-11 border-2 border-solid !bg-red-600 hover:!text-white hover:!border-none'
          loading={isLoadingDeclineFriendUser}
          onClick={() => {
            mutateDeclineFriendUser(user._id);
          }}>
          Decline
        </ButtonCancelHover>
      )}
    </>
  );
};
