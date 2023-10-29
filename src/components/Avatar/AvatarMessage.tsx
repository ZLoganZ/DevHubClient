import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import getImageURL from '@/util/getImageURL';

interface AvatarProps {
  user: UserInfoType;
  size?: number;
}

const AvatarMessage: React.FC<AvatarProps> = ({ size = 36, user }) => {
  const { members } = useAppSelector((state) => state.socketIO);
  const isActive = members.indexOf(user?._id!) !== -1;

  return (
    <div className='relative'>
      <div
        className='relative rounded-full overflow-hidden flex'
        style={{
          width: size,
          height: size
        }}>
        <img
          src={getImageURL(user.user_image, 'avatar_mini')}
          alt='Avatar'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      {isActive && (
        <span
          className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0'
          style={{
            width: size / 4,
            height: size / 4
          }}
        />
      )}
    </div>
  );
};

export default AvatarMessage;
