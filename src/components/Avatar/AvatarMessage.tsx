import { Image } from 'antd';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/configStore';

interface AvatarProps {
  user?: any;
}

const AvatarMessage = (Props: AvatarProps) => {
  const { members } = useSelector(
    (state: RootState) => state.activeListReducer
  );
  const isActive =
    members?.indexOf(Props.user?.id ? Props.user?.id : Props.user._id) !== -1 ||
    false;

  return (
    <div className="relative">
      <div className="relative rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11 flex">
        <Image
          preview={false}
          src={
            Props.user?.userImage || './images/DefaultAvatar/default_avatar.png'
          }
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      {isActive ? (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
      ) : null}
    </div>
  );
};

export default AvatarMessage;
