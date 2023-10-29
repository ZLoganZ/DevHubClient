import { UserInfoType } from '@/types';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import getImageURL from '@/util/getImageURL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getTheme } from '@/util/theme';

interface AvatarGroupProps {
  users: UserInfoType[];
  size?: number;
  image?: string;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ size = 36, users, image }) => {
  const { themeColorSet } = getTheme();

  const { members } = useAppSelector((state) => state.socketIO);
  const { currentUserInfo } = useCurrentUserInfo();

  const slicedUsers = users.length > 3 ? users.slice(0, 4) : users.slice(0, 3);
  const isActive =
    users
      .map((user) => {
        if (user._id === currentUserInfo._id) return;
        return members.indexOf(user._id) !== -1;
      })
      .indexOf(true) !== -1;

  const positionMap: { [key: number]: string } = {
    0: `top-0 left-[${size / 4}px]`,
    1: 'bottom-1',
    2: 'bottom-1 right-0'
  };

  if (users.length > 3) {
    positionMap[0] = 'top-0 left-0';
    positionMap[1] = 'top-0 right-0';
    positionMap[2] = 'bottom-0 left-0';
    positionMap[3] = 'bottom-0 right-0';
  }

  return (
    <div
      className='relative'
      style={{
        width: size,
        height: size
      }}>
      {image ? (
        <div className='relative rounded-full overflow-hidden'>
          <img
            src={getImageURL(image, 'avatar_mini')}
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
            className={`absolute inline-block rounded-full overflow-hidden ${positionMap[index]}`}
            style={{
              width: size / 2,
              height: size / 2
            }}>
            {index < 3 ? (
              <img
                src={getImageURL(user.user_image, 'avatar_mini')}
                alt='Avatar'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <span
                className='flex flex-row items-center justify-center w-full h-full'
                style={{
                  backgroundColor: themeColorSet.colorBg3
                }}>
                <FontAwesomeIcon
                  style={{
                    fontSize: size / 7,
                    color: themeColorSet.colorText2
                  }}
                  icon={faPlus}
                />
                <div
                  className='text-xs'
                  style={{
                    fontSize: size / 4,
                    color: themeColorSet.colorText2
                  }}>
                  {users.length - 3}
                </div>
              </span>
            )}
          </div>
        ))
      )}
      {isActive && (
        <span
          className={`absolute block rounded-full bg-green-500 ring-2 ring-white ${
            image ? 'top-0 right-0' : '-top-1 -right-1'
          } `}
          style={{
            width: size / 4,
            height: size / 4
          }}
        />
      )}
    </div>
  );
};

export default AvatarGroup;
