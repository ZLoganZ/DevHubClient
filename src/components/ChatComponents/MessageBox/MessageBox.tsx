import { forwardRef, useMemo } from 'react';
import { Image, Tooltip } from 'antd';
import { CrownFilled } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

import merge from '@/util/mergeClassName';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { getDateTime } from '@/util/formatDateTime';
import { handleFirstName } from '@/util/convertText';
import AvatarMessage from '@/components/ChatComponents/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { IMessage, IUserInfo, TypeofConversation } from '@/types';
import StyleProvider from './cssMessageBox';

interface IMessageBox {
  message: IMessage;
  seen: IUserInfo[];
  isPrevMesGroup: boolean;
  isNextMesGroup: boolean;
  isLastMes: boolean;
  isMoreThan10Min: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  type: TypeofConversation;
}

const MessageBox = forwardRef<HTMLDivElement, IMessageBox>(
  (
    { message, isLastMes, seen, isNextMesGroup, isPrevMesGroup, isMoreThan10Min, isAdmin, type, isCreator },
    ref
  ) => {
    // Lấy theme từ LocalStorage chuyển qua css
    useAppSelector((state) => state.theme.changed);
    const { themeColorSet } = getTheme();

    const { currentUserInfo } = useCurrentUserInfo();

    const isOwn = currentUserInfo._id === message.sender._id;
    const seenList = useMemo(() => {
      return seen.filter((user) => user._id !== message.sender._id).map((user) => user.user_image);
    }, [seen, message]);

    const containerStyle = merge(
      'flex gap-3 px-2 items-end',
      isNextMesGroup && isPrevMesGroup && 'py-[1px]',
      isNextMesGroup && !isPrevMesGroup && 'pt-1 pb-[1px]',
      !isNextMesGroup && isPrevMesGroup && 'pt-[1px] pb-1',
      !isNextMesGroup && !isPrevMesGroup && 'py-1',
      isOwn && 'justify-end'
    );

    const avatarStyle = merge(
      isOwn && 'hidden',
      (isNextMesGroup || (!isPrevMesGroup && isNextMesGroup)) && 'invisible'
    );

    const roundedCornerStyle = (isOwn: boolean, isNextMesGroup: boolean, isPrevMesGroup: boolean) => {
      if (isOwn) {
        if (isNextMesGroup && isPrevMesGroup) return 'rounded-s-[3rem] rounded-e-[1rem]';
        if (isNextMesGroup && !isPrevMesGroup) return 'rounded-t-[3rem] rounded-bl-[3rem] rounded-br-[1rem]';
        if (!isNextMesGroup && isPrevMesGroup) return 'rounded-b-[3rem] rounded-tl-[3rem] rounded-tr-[1rem]';
        if (!isNextMesGroup && !isPrevMesGroup) return 'rounded-[3rem]';
      } else {
        if (isNextMesGroup && isPrevMesGroup) return 'rounded-e-[3rem] rounded-s-[1rem]';
        if (isNextMesGroup && !isPrevMesGroup) return 'rounded-t-[3rem] rounded-br-[3rem] rounded-bl-[1rem]';
        if (!isNextMesGroup && isPrevMesGroup) return 'rounded-b-[3rem] rounded-tr-[3rem] rounded-tl-[1rem]';
        if (!isNextMesGroup && !isPrevMesGroup) return 'rounded-[3rem]';
      }
    };
    const messageStyle = merge(
      'text-sm max-w-[95%] overflow-hidden break-all',
      message.image ? 'flex p-0' : 'py-2 px-3',
      isOwn ? !message.image && 'bg-sky-500 text-white ml-7' : 'bg-gray-700 text-white mr-7',
      roundedCornerStyle(isOwn, isNextMesGroup, isPrevMesGroup)
    );

    return (
      <StyleProvider ref={ref} theme={themeColorSet}>
        {isMoreThan10Min && (
          <div className='flex justify-center my-2'>
            <div className='text-xs font-semibold' style={{ color: themeColorSet.colorText3 }}>
              {getDateTime(message.createdAt)}
            </div>
          </div>
        )}
        {message.type === 'notification' ? (
          <div className='flex justify-center mb-2'>
            <div className='text-xs font-semibold' style={{ color: themeColorSet.colorText4 }}>
              {isOwn ? 'You' : message.sender.name}&nbsp;{message.content}
            </div>
          </div>
        ) : (
          <div className={containerStyle}>
            <Tooltip
              placement='left'
              arrow={false}
              title={message.sender.name}
              overlayInnerStyle={{
                borderRadius: '0.55rem',
                backgroundColor: themeColorSet.colorBgReverse3,
                color: themeColorSet.colorTextReverse2
              }}
              mouseEnterDelay={0.2}
              autoAdjustOverflow>
              <NavLink className={avatarStyle} to={`/user/${message.sender._id}`}>
                <AvatarMessage key={message.sender._id} user={message.sender} />
              </NavLink>
            </Tooltip>
            <div className={merge('flex flex-col', isOwn && 'items-end')}>
              {type === 'group' && !isOwn && !isPrevMesGroup && (
                <div
                  className='text-sm flex items-center mb-1 ml-2'
                  style={{
                    color: themeColorSet.colorText2
                  }}>
                  <NavLink to={`/user/${message.sender._id}`}>
                    {handleFirstName(message.sender.name)}
                    {isAdmin &&
                      (isCreator ? (
                        <CrownFilled className='ml-1 text-base' />
                      ) : (
                        <FontAwesomeIcon className='ml-1' icon={faShieldHalved} />
                      ))}
                  </NavLink>
                </div>
              )}
              <div className={merge('body-message flex flex-col', isOwn && 'items-end')}>
                <Tooltip
                  placement={isOwn ? 'left' : 'right'}
                  arrow={false}
                  title={getDateTime(message.createdAt)}
                  overlayInnerStyle={{
                    borderRadius: '0.55rem',
                    backgroundColor: themeColorSet.colorBgReverse3,
                    color: themeColorSet.colorTextReverse2
                  }}
                  mouseEnterDelay={0.2}
                  autoAdjustOverflow>
                  <div className={messageStyle}>
                    {message.image ? (
                      <Image
                        className='max-h-[288px] max-w-[512px]'
                        alt='Image'
                        placeholder={true}
                        src={getImageURL(message.image, 'post')}
                        preview={{ src: getImageURL(message.image) }}
                      />
                    ) : (
                      message.content
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
                      <div
                        key={index}
                        className='inline-block rounded-full overflow-hidden h-4 w-4 -mt-1 mr-2 mb-2'>
                        <img
                          className='h-4 w-4'
                          src={getImageURL(userImage, 'avatar_mini')}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  {isOwn && (
                    <>
                      {seenList.length === 0 && message.isSending && (
                        <svg
                          className='w-4 h-4 text-gray-400 -mt-1 mr-2 mb-2'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'>
                          <circle cx='10' cy='10' r='8' stroke='currentColor' fill='none' />
                        </svg>
                      )}
                      {isLastMes && seenList.length === 0 && !message.isSending && (
                        <svg
                          className='w-4 h-4 text-gray-400 -mt-1 mr-2 mb-2'
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
        )}
      </StyleProvider>
    );
  }
);

export default MessageBox;
