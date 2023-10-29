import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import getImageURL from '@/util/getImageURL';

interface AvatarProps {
  user: UserInfoType;
}

const AvatarMessage: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useAppSelector((state) => state.socketIO);
  const isActive = members.indexOf(user?._id!) !== -1;

  return (
    <div className='relative'>
      <div className='relative rounded-full overflow-hidden h-9 w-9 flex'>
        <img
          src={getImageURL(user?.user_image)}
          alt='Avatar'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      {isActive && (
        <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2' />
      )}
    </div>
  );
};

export default AvatarMessage;
