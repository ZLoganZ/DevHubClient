import { Avatar, ConfigProvider, Upload } from 'antd';

import { useAppSelector } from '@/hooks/special';
import { getTheme } from '@/util/theme';
import { commonColor } from '@/util/cssVariable';
import StyleProvider from './cssAvatarGroupModal';

interface IChangeAvatarGroup {
  avatar?: string;
  setAvatar: (file: File) => void;
}

const AvatarGroupModal: React.FC<IChangeAvatarGroup> = ({ avatar, setAvatar }) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  return (
    <ConfigProvider theme={{ token: { controlHeight: 40, colorBorder: themeColorSet.colorBg4 } }}>
      <StyleProvider>
        <div className='flex items-center justify-center'>
          <Avatar className='h-48 w-48' src={avatar} alt='Avatar' shape='circle' />
          <Upload
            className='btnChange px-4 py-2 ml-5 rounded-full'
            accept='image/png, image/jpeg, image/jpg'
            customRequest={({ onSuccess }) => {
              if (onSuccess) onSuccess('ok');
            }}
            maxCount={1}
            onChange={(file) => setAvatar(file?.file?.originFileObj!)}
            showUploadList={false}>
            <span style={{ color: commonColor.colorWhite1 }}>Change Image</span>
          </Upload>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default AvatarGroupModal;