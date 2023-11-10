import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Space } from 'antd';

import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import { useOtherUser } from '@/hooks/special';
import { videoChat, audioCall } from '@/util/call';
import { capitalizeFirstLetter } from '@/util/convertText';

import { getTheme } from '@/util/theme';
import { getDateMonth } from '@/util/formatDateTime';
import { useAppSelector } from '@/hooks/special';
import { ICalled } from '@/types';

import StyleProvider from './cssCalledBox';

interface IConversationBox {
  called: ICalled;
  selected?: boolean;
}

const CalledBox: React.FC<IConversationBox> = ({ selected, called }) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const otherUser = useOtherUser(called.conversation_id);

  const userID = useAppSelector((state) => state.auth.userID);

  const stateCalled = (senderId: string) => {
    if (senderId === userID) {
      return 'outgoing';
    }
    return 'incoming';
  };

  const notification: Record<string, Record<string, JSX.Element>> = {
    video: {
      incoming: <FontAwesomeIcon icon={faVideo} />,
      outgoing: <FontAwesomeIcon icon={faVideo} />,
      missed: <FontAwesomeIcon icon={faVideo} />,
      call: <FontAwesomeIcon onClick={() => videoChat(called.conversation_id._id)} icon={faVideo} />
    },
    voice: {
      incoming: (
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 32 32' id='incoming-call'>
          <path d='M30.4 19.82c-.23-.36-.6-.61-1.03-.68l-9.46-1.52c-.45-.07-.89.06-1.23.36-.75.66-1.35 1.44-1.79 2.3-1.06-.6-2.05-1.36-2.93-2.24s-1.63-1.86-2.24-2.93c.86-.44 1.64-1.04 2.3-1.79.3-.33.43-.79.36-1.23l-1.52-9.46c-.07-.43-.32-.8-.68-1.03-.68-.43-1.43-.73-2.16-.87C9.46.58 8.86.5 8.22.5 3.97.5.5 3.96.5 8.22.5 21.06 10.94 31.5 23.78 31.5c4.25 0 7.72-3.46 7.72-7.72 0-.63-.08-1.24-.21-1.72a6.74 6.74 0 0 0-.89-2.24z'></path>
          <path d='M28.372 3.628a1.5 1.5 0 0 0-2.122 0l-5.307 5.307-.05-2.272a1.5 1.5 0 0 0-2.999.066l.127 5.784c.02.787.679 1.446 1.467 1.466l5.783.126a1.501 1.501 0 0 0 .065-3l-2.271-.048 5.307-5.308a1.5 1.5 0 0 0 0-2.121z'></path>
        </svg>
      ),
      outgoing: (
        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 32 32' id='outgoing-call'>
          <path d='M30.4 19.82c-.23-.36-.6-.61-1.03-.68l-9.46-1.52c-.44-.07-.9.06-1.23.36-.75.66-1.35 1.44-1.79 2.3-1.06-.6-2.05-1.36-2.93-2.24s-1.64-1.87-2.24-2.93c.86-.44 1.64-1.04 2.3-1.79.3-.33.43-.79.36-1.23l-1.52-9.46c-.07-.43-.32-.8-.68-1.03-.68-.43-1.43-.73-2.16-.87C9.46.58 8.86.5 8.22.5 3.96.5.5 3.96.5 8.22.5 21.06 10.94 31.5 23.78 31.5c4.26 0 7.72-3.46 7.72-7.72 0-.64-.08-1.24-.21-1.72-.16-.81-.46-1.56-.89-2.24z'></path>
          <path d='M18.334 13.666a1.5 1.5 0 0 0 2.121 0l5.307-5.307.05 2.273c.078 1.969 3.009 1.906 3-.067l-.127-5.783c-.018-.793-.69-1.419-1.467-1.467l-5.783-.127c-1.977.028-2.036 2.911-.067 3l2.273.05-5.307 5.307a1.5 1.5 0 0 0 0 2.121z'></path>
        </svg>
      ),
      missed: (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' id='missed-call' width='16' height='16'>
          <g data-name='Layer 2'>
            <g data-name='phone-missed'>
              <path d='M21.94 16.64a4.34 4.34 0 0 0-.19-.73 1 1 0 0 0-.72-.65l-6-1.37a1 1 0 0 0-.92.26c-.14.13-.15.14-.8 1.38a10 10 0 0 1-4.88-4.89C9.71 10 9.72 10 9.85 9.85a1 1 0 0 0 .26-.92L8.74 3a1 1 0 0 0-.65-.72 3.79 3.79 0 0 0-.72-.18A3.94 3.94 0 0 0 6.6 2 4.6 4.6 0 0 0 2 6.6 15.42 15.42 0 0 0 17.4 22a4.6 4.6 0 0 0 4.6-4.6 4.77 4.77 0 0 0-.06-.76zM15.8 8.7a1.05 1.05 0 0 0 1.47 0L18 8l.73.73a1 1 0 0 0 1.47-1.5l-.73-.73.73-.73a1 1 0 0 0-1.47-1.47L18 5l-.73-.73a1 1 0 0 0-1.47 1.5l.73.73-.73.73a1.05 1.05 0 0 0 0 1.47z'></path>
            </g>
          </g>
        </svg>
      ),
      call: <FontAwesomeIcon onClick={() => audioCall(called.conversation_id._id)} icon={faPhone} />
    }
  };

  return (
    <StyleProvider theme={themeColorSet}>
      <div
        className='conversation-box w-full flex items-center space-x-3 my-3 p-3 rounded-xl transition'
        style={{
          backgroundColor: selected ? themeColorSet.colorBg2 : themeColorSet.colorBg1
        }}>
        {called.conversation_id.type === 'group' ? (
          <AvatarGroup
            key={called.conversation_id._id}
            users={called.conversation_id.members}
            image={called.conversation_id.image}
          />
        ) : (
          <Avatar key={called.conversation_id._id} user={otherUser} />
        )}

        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <div className='flex justify-between items-center mb-1'>
              <div>
                <p
                  className='text-md font-medium'
                  style={{
                    color: themeColorSet.colorText1
                  }}>
                  <span style={{ color: themeColorSet.colorText1 }}>
                    {called.conversation_id.name ?? otherUser.name}
                  </span>
                </p>
                <Space
                  size={5}
                  direction='horizontal'
                  align='center'
                  style={{ color: themeColorSet.colorText3 }}>
                  <div className='icon'>{notification[called.type][stateCalled(called.sender._id)]}</div>
                  <div className='state-called'>{capitalizeFirstLetter(stateCalled(called.sender._id))}</div>
                  &nbsp; •<div className='time'>{getDateMonth(called.createdAt)}</div>
                </Space>
              </div>
              <div className='call'>{notification[called.type].call}</div>
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default CalledBox;
