import { Image } from 'antd';
import { NavLink } from 'react-router-dom';

import StyleProvider from './cssMessageBox';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { MessageType, UserInfoType } from '@/types';
import { useMemo } from 'react';
import getImageURL from '@/util/getImageURL';

interface MessageBoxProps {
  message: MessageType;
  seen: UserInfoType[];
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, isLast, seen }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();

  const isOwn = currentUserInfo?._id === (message.sender as UserInfoType)._id;
  const seenList = useMemo(() => {
    return seen
      .filter((user) => user._id !== (message.sender as UserInfoType)._id)
      .map((user) => user.user_image);
  }, [seen, message.sender]);

  const messageStyle = `text-sm w-fit overflow-hidden break-all
    ${message.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'}
    ${
      isOwn && !message.image
        ? 'bg-sky-500 text-white ml-7'
        : message.image
        ? ''
        : 'bg-gray-700 text-white mr-7'
    }`;

  return (
    <StyleProvider theme={themeColorSet}>
      <div className={`flex gap-3 px-2 py-4 items-center ${isOwn && 'justify-end'}`}>
        <NavLink className={`${isOwn && 'hidden'}`} to={`/user/${(message.sender as UserInfoType)._id}`}>
          <Avatar key={(message.sender as UserInfoType)._id} user={message.sender as UserInfoType} />
        </NavLink>
        <div className={`flex flex-col ${isOwn && 'items-end'}`}>
          <div className={`body-message flex flex-col ${isOwn && 'items-end'}`}>
            <div className={messageStyle}>
              {message.image ? (
                <Image
                  alt='Image'
                  src={message.image}
                  draggable={false}
                  className='object-cover cursor-pointer'
                  style={{
                    borderRadius: '2rem',
                    border: '0.2px solid',
                    maxHeight: '288px',
                    maxWidth: '512px'
                  }}
                />
              ) : (
                <div>{message.content}</div>
              )}
            </div>
            <div
              className={`time-message text-xs font-light w-max`}
              style={{
                color: themeColorSet.colorText2
              }}>
              {formatDateTime(message.createdAt)}
            </div>
          </div>
          <div
            className={`seen-message text-xs font-light`}
            style={{
              color: themeColorSet.colorText3
            }}>
            <div className='relative flex flex-row'>
              {isLast &&
                isOwn &&
                seenList.length > 0 &&
                seenList.map((user, index) => (
                  <div key={index} className='inline-block rounded-full overflow-hidden h-4 w-4 mr-2'>
                    <img
                      className='h-4 w-4'
                      src={getImageURL(user, 'avatar_mini')}
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default MessageBox;
