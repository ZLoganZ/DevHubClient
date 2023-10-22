import { ConfigProvider, Input, Select } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import StyleProvider from './cssGroupChatModal';

interface GroupChatModalProps {
  users: UserInfoType[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

interface Option {
  label: string;
  value: string;
  id: string;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ users, setName, setValue }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 40,
          colorBorder: themeColorSet.colorBg4
        }
      }}>
      <StyleProvider>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <p className='mt-1 text-sm leading-6 text-gray-300'>Create a chat with more than 2 people.</p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <Input
                style={{ boxShadow: 'none' }}
                placeholder={`Group's name`}
                allowClear
                onChange={(event) => {
                  setName(event.currentTarget.value);
                }}
              />
              <Select
                mode='multiple'
                placeholder='Select members'
                options={users.map((user) => ({
                  label: user.name,
                  value: user.name,
                  id: user._id
                }))}
                onChange={(_, option) => {
                  setValue((option as unknown as Option[]).map((item) => item.id));
                }}
              />
            </div>
          </div>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default GroupChatModal;
