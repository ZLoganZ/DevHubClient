import Avatar from '@/components/Avatar/AvatarMessage';
import AvatarGroup from '@/components/Avatar/AvatarGroup';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import { getTheme } from '@/util/theme';
import StyleProvider from './cssChatWelcome';

type TypeofConversation = 'private' | 'group';
interface ChatWelcomeProps {
  type: TypeofConversation;
  name: string;
  otherUser: UserInfoType;
  members: UserInfoType[];
  image?: string;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ name, type, members, otherUser, image }) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='chatWelcome'>
        <div className='chatWelcome__container'>
          <div className='chatWelcome__container__header'>
            <div className='chatWelcome__container__header__avatar'>
              {type === 'private' ? (
                <Avatar user={otherUser} size={80} />
              ) : (
                <AvatarGroup users={members} image={image} size={80} />
              )}
            </div>
            <div className='chatWelcome__container__header__name'>
              {type === 'private' ? otherUser.name : name}
            </div>
            <div className='chatWelcome__container__header__members'>
              {type === 'private' ? '' : `${members.length} members in this group`}
            </div>
          </div>
          <div className='chatWelcome__container__body'>
            <div className='chatWelcome__container__body__text'>
              {type === 'private'
                ? `Send photos and messages to your friend.`
                : `Send photos and messages to your group.`}
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default ChatWelcome;
