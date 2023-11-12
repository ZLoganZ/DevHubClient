import { NavLink } from 'react-router-dom';

import AvatarMessage from '@/components/ChatComponents/Avatar/AvatarMessage';
import AvatarGroup from '@/components/ChatComponents/Avatar/AvatarGroup';
import { useAppSelector } from '@/hooks/special';
import { IUserInfo } from '@/types';
import { getTheme } from '@/util/theme';
import StyleProvider from './cssChatWelcome';

type TypeofConversation = 'private' | 'group';
interface IChatWelcome {
  type: TypeofConversation;
  name: string;
  otherUser: IUserInfo;
  members: IUserInfo[];
  image?: string;
}

const ChatWelcome: React.FC<IChatWelcome> = ({ name, type, members, otherUser, image }) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider className='pt-2' theme={themeColorSet}>
      <div className='chatWelcome'>
        <div className='chatWelcome__container'>
          <div className='chatWelcome__container__header'>
            <div className='chatWelcome__container__header__avatar'>
              {type === 'private' ? (
                <NavLink to={`/user/${otherUser._id}`}>
                  <AvatarMessage user={otherUser} size={80} />
                </NavLink>
              ) : (
                <AvatarGroup users={members} image={image} size={80} />
              )}
            </div>
            <div className='chatWelcome__container__header__name'>
              {name ?? <NavLink to={`/user/${otherUser._id}`}>{otherUser.name}</NavLink>}
            </div>
            <div className='chatWelcome__container__header__members'>
              {type === 'private' ? '' : `${members.length} members in this group`}
            </div>
          </div>
          <div className='chatWelcome__container__body'>
            <div className='chatWelcome__container__body__text'>
              {type === 'private'
                ? `Send photos and messages to your friend`
                : `Send photos and messages to your group`}
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default ChatWelcome;
