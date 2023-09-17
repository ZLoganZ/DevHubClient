import { ConfigProvider, Input, Select } from 'antd';
import { useSelector } from 'react-redux';

import { getTheme } from '@/util/functions/ThemeFunction';
import { RootState } from '@/redux/configStore';
import StyleTotal from './cssGroupChatModal';

interface GroupChatModalProps {
  users: any;
  setValue: (value: any) => void;
  setName: (name: any) => void;
}

const GroupChatModal = (Props: GroupChatModalProps) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();
  return (
    <ConfigProvider
      theme={{
        token: {
          ...themeColor,
          controlHeight: 40,
          colorBorder: themeColorSet.colorBg4
        }
      }}>
      <StyleTotal>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-300">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                style={{ boxShadow: 'none' }}
                placeholder={`Group's name`}
                allowClear
                onChange={(event) => {
                  Props.setName(event.currentTarget.value);
                }}
              />
              <Select
                mode="multiple"
                placeholder="Select members"
                options={Props.users.map((user: any) => ({
                  label: user.username,
                  value: user.username,
                  id: user._id
                }))}
                onChange={(value, options) => {
                  options.forEach((option: any, index: any) => {
                    value[index] = option.id;
                  });
                  Props.setValue(value);
                }}
              />
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default GroupChatModal;
