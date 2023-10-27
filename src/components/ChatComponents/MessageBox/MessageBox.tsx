import { Image, Tooltip } from 'antd';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import StyleProvider from './cssMessageBox';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';

import { MessageType, UserInfoType } from '@/types';
import getImageURL from '@/util/getImageURL';

interface IMessageBox {
  message: MessageType;
  seen: UserInfoType[];
  isPrevMesGroup: boolean;
  isNextMesGroup: boolean;
  isLastMes: boolean;
}

const MessageBox: React.FC<IMessageBox> = ({ message, isLastMes, seen, isNextMesGroup, isPrevMesGroup }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { currentUserInfo } = useCurrentUserInfo();

  const isOwn = currentUserInfo?._id === message.sender._id;
  const seenList = useMemo(() => {
    return seen.filter((user) => user._id !== message.sender._id).map((user) => user.user_image);
  }, [seen, message]);

  const containerStyle = `flex gap-3 px-2 items-center
  ${isNextMesGroup && isPrevMesGroup ? 'py-0.5' : ''}
  ${isNextMesGroup && !isPrevMesGroup ? 'pt-2 pb-0.5' : ''}
  ${!isNextMesGroup && isPrevMesGroup ? 'pt-0.5 pb-2' : ''}
  ${!(isNextMesGroup || isPrevMesGroup) ? 'py-2' : ''}
  ${isOwn ? 'justify-end' : ''}`;

  const avatarStyle = `${isOwn ? 'hidden' : ''}
  ${isNextMesGroup || (!isPrevMesGroup && isNextMesGroup) ? 'invisible' : ''}`;

  const messageStyle = `text-sm w-fit overflow-hidden break-all
  ${message.image ? 'p-0' : 'py-2 px-3'}
  ${isOwn ? (message.image ? '' : 'bg-sky-500 text-white ml-7') : 'bg-gray-700 text-white mr-7'}
  ${isOwn && isNextMesGroup ? 'rounded-s-2xl' : ''}
  ${isOwn && isNextMesGroup && !isPrevMesGroup ? 'rounded-t-2xl rounded-bl-2xl' : ''}
  ${isOwn && !isNextMesGroup && isPrevMesGroup ? 'rounded-b-2xl rounded-tl-2xl' : ''}
  ${isOwn && !isNextMesGroup && !isPrevMesGroup ? 'rounded-2xl' : ''}
  ${!isOwn && isNextMesGroup ? 'rounded-e-2xl' : ''}
  ${!isOwn && isNextMesGroup && !isPrevMesGroup ? 'rounded-t-2xl rounded-br-2xl' : ''}
  ${!isOwn && !isNextMesGroup && isPrevMesGroup ? 'rounded-b-2xl rounded-tr-2xl' : ''}
  ${!isOwn && !isNextMesGroup && !isPrevMesGroup ? 'rounded-2xl' : ''}`;

  return (
    <StyleProvider theme={themeColorSet}>
      <div className={containerStyle}>
        <NavLink className={avatarStyle} to={`/user/${message.sender._id}`}>
          <Avatar key={message.sender._id} user={message.sender} />
        </NavLink>
        <div className={`flex flex-col ${isOwn && 'items-end'}`}>
          <div className={`body-message flex flex-col ${isOwn && 'items-end'}`}>
            <Tooltip
              placement={isOwn ? 'left' : 'right'}
              arrow={false}
              title={formatDateTime(message.createdAt)}
              overlayInnerStyle={{
                borderRadius: '0.55rem',
                backgroundColor: themeColorSet.colorBgReverse3,
                color: themeColorSet.colorTextReverse2,
                fontWeight: 500
              }}
              mouseEnterDelay={0.2}
              destroyTooltipOnHide
              autoAdjustOverflow>
              <div className={messageStyle}>
                {message.image ? (
                  <Image
                    alt='Image'
                    src={getImageURL(message.image, 'post')}
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
          <div className='seen-message text-xs font-light' style={{ color: themeColorSet.colorText3 }}>
            <div className='relative flex flex-row'>
              {isLastMes &&
                isOwn &&
                seenList.length > 0 &&
                seenList.map((userImage, index) => (
                  <div key={index} className='inline-block rounded-full overflow-hidden h-4 w-4 mr-2'>
                    <img
                      className='h-4 w-4'
                      src={getImageURL(userImage, 'avatar_mini')}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              {isOwn && (
                <>
                  {seenList.length === 0 && message.isSending && (
                    <svg
                      className='w-4 h-4 text-gray-400 mr-2'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'>
                      <circle cx='10' cy='10' r='8' stroke='currentColor' fill='none' />
                    </svg>
                  )}

                  {isLastMes && seenList.length === 0 && !message.isSending && (
                    <svg
                      className='w-4 h-4 text-gray-400 mr-2'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fillRule='evenodd'
                        d='M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.707a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l5.5-5.5a1 1 0 10-1.414-1.414L10.5 9.086 8.707 7.707z'
                      />
                    </svg>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default MessageBox;
