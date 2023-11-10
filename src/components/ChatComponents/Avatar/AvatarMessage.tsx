import { useAppSelector } from '@/hooks/special';
import { IUserInfo } from '@/types';
import merge from '@/util/mergeClassName';
import getImageURL from '@/util/getImageURL';

interface IAvatar {
  user: IUserInfo;
  size?: number;
}

const AvatarMessage: React.FC<IAvatar> = ({ size = 36, user }) => {
  const { members } = useAppSelector((state) => state.socketIO);
  const isActive = members.some((member) => member._id === user._id && member.is_online);

  return (
    <div className='relative'>
      <div className='relative rounded-full overflow-hidden flex' style={{ width: size, height: size }}>
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
          className={merge(
            'absolute block rounded-full bg-green-500 ring-white top-0 right-0',
            size / 4 < 10 ? 'ring-2' : 'ring-4'
          )}
          style={{ width: size / 4, height: size / 4 }}
        />
      )}
    </div>
  );
};

export default AvatarMessage;
