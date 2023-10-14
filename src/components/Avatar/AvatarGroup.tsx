import { Image } from 'antd';

import { UserInfoType } from '@/types';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import getImageURL from '@/util/getImageURL';

interface AvatarGroupProps {
  users: UserInfoType[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const { members } = useAppSelector((state) => state.socketIO);
  const { currentUserInfo } = useCurrentUserInfo();

  const slicedUsers = users.slice(0, 3);
  const isActive = users.map((user) => {
    if (user._id === currentUserInfo._id) return;
    return members.indexOf(user._id) !== -1;
  });

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  };

  return (
    <div className='relative h-11 w-11'>
      {slicedUsers.map((user, index) => (
        <div
          key={user._id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[index as keyof typeof positionMap]
          }`}>
          <Image
            preview={false}
            src={getImageURL(user.user_image)}
            alt='Avatar'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ))}
      {isActive.indexOf(true) !== -1 && (
        <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-9 h-2 w-2 md:h-3 md:w-3' />
      )}
    </div>
  );
};

export default AvatarGroup;
