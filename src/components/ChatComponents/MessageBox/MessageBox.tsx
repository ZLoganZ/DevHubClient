import { Image } from 'antd';
import { NavLink } from 'react-router-dom';
import { isThisYear, isThisWeek, isToday, format } from 'date-fns';

import StyleTotal from './cssMessageBox';
import { getTheme } from '@/util/functions/ThemeFunction';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useAppSelector, useUserInfo } from '@/hooks';

interface MessageBoxProps {
  data: any;
  isLast?: boolean;
}

const MessageBox = (Props: MessageBoxProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const { userInfo } = useUserInfo();

  const isOwn = userInfo._id === Props.data.sender._id;
  const seenList = (Props.data.seen || [])
    .filter((user: any) => user._id !== Props.data?.sender?._id)
    .map((user: any) => user.name)
    .join(', ');

  const container = `flex gap-3 p-4 ${isOwn && 'justify-end'}`;
  const avatar = `mt-3 ${isOwn && 'order-2'}`;
  const body = `flex flex-col ${isOwn && 'items-end'}`;
  const message = `text-sm w-fit overflow-hidden break-all
    ${Props.data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'}
    ${
      isOwn && !Props.data.image
        ? 'bg-sky-500 text-white ml-7'
        : Props.data.image
        ? ''
        : 'bg-gray-700 text-white mr-7'
    }`;

  const formatDateTime = (date: any) => {
    if (isToday(date)) {
      return format(date, 'p'); // Display only time for today
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, 'iiii, p'); // Display full day of the week and time for this week
    } else if (isThisYear(date)) {
      return format(date, 'eeee, MMMM d • p'); // Display full day of the week, date, and time for this year
    } else {
      return format(date, 'eeee, MMMM d, yyyy • p'); // Display full day of the week, date, year, and time for other cases
    }
  };

  return (
    <StyleTotal theme={themeColorSet}>
      <div className={container}>
        <NavLink className={avatar} to={`/user/${Props.data.sender._id}`}>
          <Avatar key={Props.data.sender._id} user={Props.data.sender} />
        </NavLink>
        <div className={body}>
          <div className={`body-message flex flex-col ${isOwn && 'items-end'}`}>
            <div className="flex items-center gap-1 mb-1">
              <div
                className={`text-sm `}
                style={{
                  color: themeColorSet.colorText1
                }}>
                {Props.data.sender.name}
              </div>
            </div>
            <div className={message}>
              {Props.data.image ? (
                <Image
                  alt="Image"
                  src={Props.data.image}
                  draggable={false}
                  className="object-cover cursor-pointer"
                  style={{
                    borderRadius: '2rem',
                    border: '0.2px solid',
                    maxHeight: '288px',
                    maxWidth: '512px'
                  }}
                />
              ) : (
                <div>{Props.data.body}</div>
              )}
            </div>
            <div
              className={`time-message text-xs mt-1`}
              style={{
                color: themeColorSet.colorText2
              }}>
              {formatDateTime(new Date(Props?.data?.createdAt))}
            </div>
          </div>
          {Props.isLast && isOwn && seenList.length > 0 && (
            <div
              className={`seen-message text-xs font-light`}
              style={{
                color: themeColorSet.colorText3
              }}>{`Seen by ${seenList}`}</div>
          )}
        </div>
      </div>
    </StyleTotal>
  );
};

export default MessageBox;
