import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { format, isThisWeek, isThisYear, isToday } from 'date-fns';

import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks';
import { getTheme } from '@/util/functions/ThemeFunction';
import { RootState } from '@/redux/configStore';

interface ConversationBoxProps {
  data: any;
  selected?: boolean;
}

const ConversationBox = (Props: ConversationBoxProps) => {
  const otherUser = useOtherUser(Props.data);
  const userInfo = useSelector(
    (state: RootState) => state.userReducer.userInfo
  );
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const lastMessage = useMemo(() => {
    const messages = Props.data.messages || [];

    return messages[messages.length - 1];
  }, [Props.data.messages]);

  const isOwn = userInfo.id === lastMessage?.sender._id;

  const userID = useMemo(() => {
    return userInfo.id;
  }, [userInfo]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArr = lastMessage.seen || [];

    if (!userID) return false;

    return seenArr.some((user: any) => user._id === userID);
  }, [lastMessage, userID]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an image';

    if (lastMessage?.body) return lastMessage.body;

    return 'Start a conversation';
  }, [lastMessage, userID]);

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
    <div
      className={`w-full relative flex items-center space-x-3 my-3 p-3 hover:bg-neutral-100rounded-lg transition cursor-pointer`}
      style={{
        backgroundColor: Props.selected
          ? themeColorSet.colorBg2
          : themeColorSet.colorBg1
      }}>
      {Props.data.isGroup ? (
        <AvatarGroup key={Props.data._id} users={Props.data.users} />
      ) : (
        <Avatar key={Props.data._id} user={otherUser} />
      )}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p
              className={`text-md font-medium`}
              style={{
                color: themeColorSet.colorText1
              }}>
              <span style={{ color: themeColorSet.colorText1 }}>
                {Props.data.name || otherUser.username}
              </span>
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
                style={{ color: themeColorSet.colorText3 }}>
                {formatDateTime(new Date(lastMessage.createdAt))}
              </p>
            )}
          </div>
          <p
            className={`truncate text-sm ${
              hasSeen
                ? themeColorSet.colorText1
                : themeColorSet.colorText1 + ' shadow-xl font-extrabold'
            }`}>
            <span style={{ color: themeColorSet.colorText2 }}>
              {isOwn ? `You: ${lastMessageText}` : lastMessageText}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
