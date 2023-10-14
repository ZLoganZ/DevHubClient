import { useEffect, useMemo, useState } from 'react';

import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { ConversationType, MessageType, UserInfoType } from '@/types';
import { PRIVATE_MSG, SEEN_MSG } from '@/util/constants/SettingSystem';

interface ConversationBoxProps {
  data: ConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);

  const { currentUserInfo } = useCurrentUserInfo();

  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const [lastMessage, setLastMessage] = useState(data.lastMessage);

  const isOwn = useMemo(() => {
    return currentUserInfo._id === lastMessage.sender._id;
  }, [lastMessage]);

  const userID = useMemo(() => {
    return currentUserInfo._id;
  }, [currentUserInfo]);

  const [seenArr, setSeenArr] = useState<UserInfoType[]>(data.seen);

  useEffect(() => {
    chatSocket.on(PRIVATE_MSG + data._id, (message: MessageType) => {
      setSeenArr([]);
      setLastMessage(message);
    });
    chatSocket.on(SEEN_MSG + data._id, (conversation: ConversationType) => {
      setSeenArr(conversation.seen);
    });
  }, []);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    return seenArr.some((user) => user._id === userID);
  }, [lastMessage, seenArr]);

  const lastMessageText = useMemo(() => {
    if (lastMessage.image) return 'Sent an image';

    if (lastMessage.content) return lastMessage.content;

    return 'Start a conversation';
  }, [lastMessage, userID]);

  return (
    <div
      className='w-full relative flex items-center space-x-3 my-3 p-3 hover:bg-neutral-100rounded-lg transition cursor-pointer'
      style={{
        backgroundColor: selected ? themeColorSet.colorBg2 : themeColorSet.colorBg1
      }}>
      {data.type === 'group' ? (
        <AvatarGroup key={data._id} users={data.members} />
      ) : (
        <Avatar key={data._id} user={otherUser} />
      )}

      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <span className='absolute inset-0' aria-hidden='true' />
          <div className='flex justify-between items-center mb-1'>
            <p
              className={`text-md font-medium`}
              style={{
                color: themeColorSet.colorText1
              }}>
              <span style={{ color: themeColorSet.colorText1 }}>{data.name || otherUser.name}</span>
            </p>
            {lastMessage && (
              <p className=' text-xs text-gray-400 font-light' style={{ color: themeColorSet.colorText3 }}>
                {formatDateTime(lastMessage.createdAt)}
              </p>
            )}
          </div>
          <p
            className={`truncate text-sm ${
              !hasSeen && !isOwn
                ? themeColorSet.colorText1 + ' shadow-xl font-extrabold'
                : themeColorSet.colorText1
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
