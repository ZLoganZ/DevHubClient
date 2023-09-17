import { Image } from 'antd';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/configStore';
import { UserInfoType } from '@/types';

interface AvatarProps {
  users: UserInfoType[];
}

const AvatarGroup = (Props: AvatarProps) => {
  const { members } = useSelector(
    (state: RootState) => state.activeListReducer
  );
  const userInfo = useSelector(
    (state: RootState) => state.userReducer.userInfo
  );

  const slicedUsers = Props.users.slice(0, 3);
  const isActive = Props.users?.map((user) => {
    if (user.id === userInfo.id) return;
    return members.indexOf(user.id) !== -1;
  });

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[index as keyof typeof positionMap]
          }`}>
          <Image
            preview={false}
            src={
              user?.user_image || './images/DefaultAvatar/default_avatar.png'
            }
            alt="Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ))}
      {isActive.indexOf(true) !== -1 ? (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-9 h-2 w-2 md:h-3 md:w-3" />
      ) : null}
    </div>
  );
};

export default AvatarGroup;
