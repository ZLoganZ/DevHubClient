import { Image, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';

import StyleProvider from './cssMessageBox';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';

import { useMemo, useState } from 'react';
import { MessageType, UserInfoType } from '@/types';
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

  const isOwn = currentUserInfo?._id === message.sender._id;
  const seenList = useMemo(() => {
    return seen.filter((user) => user._id !== message.sender._id).map((user) => user.user_image);
  }, [seen, message]);

  const messageStyle = `text-sm w-fit overflow-hidden break-all
    ${message.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'}
    ${
      isOwn && !message.image
        ? 'bg-sky-500 text-white ml-7'
        : message.image
        ? ''
        : 'bg-gray-700 text-white mr-7'
    }`;

  const options = ['Show', 'Hide', 'Center'];
  const [arrow, setArrow] = useState('Show');

  const mergedArrow = useMemo(() => {
    if (arrow === 'Hide') {
      return false;
    }

    if (arrow === 'Show') {
      return true;
    }

    return {
      pointAtCenter: true
    };
  }, [arrow]);

  return (
    <StyleProvider theme={themeColorSet}>
      <div className={`flex gap-3 px-2 py-4 items-center ${isOwn && 'justify-end'}`}>
        <NavLink className={`${isOwn && 'hidden'}`} to={`/user/${message.sender._id}`}>
          <Avatar key={message.sender._id} user={message.sender} />
        </NavLink>
        <div className={`flex flex-col ${isOwn && 'items-end'}`}>
          <div className={`body-message flex flex-col ${isOwn && 'items-end'}`}>
            <div className='flex items-center gap-1 mb-1'>
              <div
                className={`text-sm`}
                style={{
                  color: themeColorSet.colorText1
                }}>
                {message.sender.name}
              </div>
            </div>
            <Tooltip
              placement='left'
              title={formatDateTime(message.createdAt)}
              arrow={mergedArrow}
              mouseEnterDelay={0.5}
              destroyTooltipOnHide={true}
              autoAdjustOverflow={true}>
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
            </Tooltip>
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
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              {isLast && isOwn && seenList.length === 0 && !message.isSending && (
                <div>
                  <svg
                    className='w-4 h-4 text-gray-400 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      d='M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.707a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l5.5-5.5a1 1 0 10-1.414-1.414L10.5 9.086 8.707 7.707z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default MessageBox;
