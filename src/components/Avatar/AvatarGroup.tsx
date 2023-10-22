import { UserInfoType } from '@/types';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import getImageURL from '@/util/getImageURL';

interface AvatarGroupProps {
  users: UserInfoType[];
  image?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, image }) => {
  const { members } = useAppSelector((state) => state.socketIO);
  const { currentUserInfo } = useCurrentUserInfo();

  const slicedUsers = users.slice(0, 3);
  const isActive =
    users
      .map((user) => {
        if (user._id === currentUserInfo._id) return;
        return members.indexOf(user._id) !== -1;
      })
      .indexOf(true) !== -1;

  const positionMap: { [key: number]: string } = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  };

  return (
    <div className='relative h-9 w-9 md:h-11 md:w-11'>
      {image ? (
        <div className='relative rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
          <img
            src={getImageURL(image)}
            alt='Avatar'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ) : (
        slicedUsers.map((user, index) => (
          <div
            key={user._id}
            className={`absolute inline-block rounded-full overflow-hidden h-[18px] w-[18px] md:h-[21px] md:w-[21px] ${positionMap[index]}`}>
            <img
              src={getImageURL(user.user_image)}
              alt='Avatar'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))
      )}
      {isActive && (
        <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3' />
      )}
    </div>
  );
};

export default AvatarGroup;
