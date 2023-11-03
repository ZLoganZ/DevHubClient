import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {

  faVideo,
} from '@fortawesome/free-solid-svg-icons';

import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import videoChat from '@/util/videoChat';
import audioCall from '@/util/audioCall';
import { getTheme } from '@/util/theme';
import { getDateTimeToNow } from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { ConversationType } from '@/types';

import StyleProvider from './cssCalledBox';

interface IConversationBox {
  conversation: ConversationType;
  selected?: boolean;
}

const CalledBox: React.FC<IConversationBox> = ({ conversation, selected }) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  const otherUser = useOtherUser(conversation);
  return (
    <StyleProvider theme={themeColorSet}>
      <div
        className='conversation-box w-full relative flex items-center space-x-3 my-3 p-3 rounded-xl transition'
        style={{
          backgroundColor: selected ? themeColorSet.colorBg2 : themeColorSet.colorBg1
        }}>
        {conversation.type === 'group' ? (
          <AvatarGroup key={conversation._id} users={conversation.members} image={conversation.image} />
        ) : (
          <Avatar key={conversation._id} user={otherUser} />
        )}

        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <span className='absolute inset-0' aria-hidden='true' />
            <div className='flex justify-between items-center mb-1'>
              <div>
                <p
                  className={`text-md font-medium`}
                  style={{
                    color: themeColorSet.colorText1
                  }}>
                  <span style={{ color: themeColorSet.colorText1 }}>
                    {conversation.name ?? otherUser.name}
                  </span>
                </p>
                {conversation.lastMessage?.createdAt && (
                  <p
                    className=' text-xs  text-gray-400 font-light'
                    style={{ color: themeColorSet.colorText3 }}>
                    Cuộc gọi đến {getDateTimeToNow(conversation.lastMessage.createdAt)}
                  </p>
                )}
              </div>
              <FontAwesomeIcon icon={faVideo} />
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default CalledBox;
