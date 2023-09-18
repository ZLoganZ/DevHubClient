import { ConfigProvider } from 'antd';
import React from 'react';

import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppSelector } from '@/hooks';
import './Day&NightSwitch.css';

interface Props {
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const DayNightSwitch = (Props: Props) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <div className="containerButton inline">
        <div className="switch">
          <label htmlFor="toggle">
            <input
              id="toggle"
              className="toggle-switch"
              type="checkbox"
              defaultChecked={!Props?.checked}
              onClick={() => {
                if (Props && Props.onChange) {
                  Props.onChange(!Props.checked);
                }
              }}
            />
            <div className="sun-moon">
              <div className="dots" />
            </div>
            <div className="background">
              <div className="stars1" />
              <div className="stars2" />
            </div>
          </label>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DayNightSwitch;
