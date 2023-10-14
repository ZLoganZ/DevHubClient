import { useMemo } from 'react';

import AvatarGroup from '@/components/Avatar/AvatarGroup';
import Avatar from '@/components/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { getTheme } from '@/util/theme';
import formatDateTime from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';

import StyleProvider from './cssConversationBox';

interface ConversationBoxProps {
  data: any; // conversationItem
  selected?: boolean; // conversationID
}

const ConversationBox = (Props: ConversationBoxProps) => {
  const otherUser = useOtherUser(Props.data);
  // if(otherUser) console.log('otherUser:: ', otherUser);

  const { currentUserInfo } = useCurrentUserInfo();

  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  // Props.data?.lastMessage;
  const lastMessage = useMemo(() => {
    return Props.data?.lastMessage;
  }, [Props.data?.lastMessage]);

  // if(lastMessage) console.log('lastMessage:: ', lastMessage);

  const isOwn = currentUserInfo?._id === lastMessage?.sender;

  const userID = useMemo(() => {
    return currentUserInfo?._id;
  }, [currentUserInfo]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArr = lastMessage.seen || [];

    if (!userID) return false;

    return seenArr.some((user: any) => user._id === userID);
  }, [lastMessage, userID]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an image';

    if (lastMessage?.content) return lastMessage.content;

    return 'Start a conversation';
  }, [lastMessage, userID]);

  return (
    <StyleProvider theme={themeColorSet}>
      <div
        className='conversation-box w-full relative flex items-center space-x-3 my-3 p-3 rounded-lg transition'
        style={{
          backgroundColor: Props.selected ? themeColorSet.colorBg2 : themeColorSet.colorBg1
        }}>
        {Props.data.type === 'group' ? (
          <AvatarGroup key={Props.data._id} users={Props.data.members} />
        ) : (
          <Avatar key={Props.data._id} user={otherUser} />
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
                <span style={{ color: themeColorSet.colorText1 }}>{Props.data.name || otherUser.name}</span>
              </p>
              {lastMessage?.createdAt && (
                <p
                  className='
                  text-xs 
                  text-gray-400 
                  font-light
                '
                  style={{ color: themeColorSet.colorText3 }}>
                  {formatDateTime(lastMessage.createdAt)}
                </p>
              )}
            </div>
            <p
              className={`truncate text-sm ${
                hasSeen ? themeColorSet.colorText1 : themeColorSet.colorText1 + ' font-extrabold'
              }`}>
              <span style={{ color: themeColorSet.colorText2 }}>
                {isOwn ? `You: ${lastMessageText}` : lastMessageText}
              </span>
            </p>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default ConversationBox;
