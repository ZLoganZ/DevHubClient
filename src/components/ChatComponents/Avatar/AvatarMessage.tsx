import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { Image } from 'antd';

import { useAppSelector } from '@/hooks/special';
import { IUserInfo } from '@/types';
import merge from '@/util/mergeClassName';
import getImageURL from '@/util/getImageURL';

interface IAvatar {
  user: IUserInfo;
  size?: number;
  preview?: boolean;
}

const AvatarMessage: React.FC<IAvatar> = ({ size = 36, user, preview = false }) => {
  const { activeMembers: members } = useAppSelector((state) => state.socketIO);
  const isActive = members.some((member) => member._id === user._id && member.is_online);

  return (
    <div className='relative'>
      <div className='relative rounded-full overflow-hidden flex' style={{ width: size, height: size }}>
        <Image
          src={getImageURL(user.user_image, 'avatar_mini')}
          alt='Avatar'
          preview={
            preview ? { src: getImageURL(user.user_image), mask: <FontAwesomeIcon icon={faEye} /> } : false
          }
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
            size / 4 < 20 ? 'ring-2' : 'ring-4'
          )}
          style={{ width: size / 4, height: size / 4 }}
        />
      )}
    </div>
  );
};

export default AvatarMessage;
