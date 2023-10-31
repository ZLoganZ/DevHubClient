import { faBriefcase, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, ConfigProvider, Radio, Space, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonActiveHover } from '@/components/MiniComponent';

import { commonColor } from '@/util/cssVariable';
import { getTheme } from '@/util/theme';
import { CHOOSE_GET_STARTED_SAGA } from '@/redux/ActionSaga/GetStartedActionSaga';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssGetStarted';

const GetStarted = () => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);
  const [value, setValue] = useState(0);

  const handleChooseRadio1 = () => {
    setRadio1(true);
    setRadio2(false);
    setValue(1);
  };
  const handleChooseRadio2 = () => {
    setRadio1(false);
    setRadio2(true);
    setValue(2);
  };

  // Hàm hiển thị mesage
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Please choose one of the options'
    });
  };

  return (
    <StyleProvider theme={themeColorSet}>
      {contextHolder}
      <div className='flex justify-center w-full h-full getStarted '>
        <div className='content w-1/2 pt-10 h-full relative'>
          <div>
            <span className='mr-3' style={{ color: themeColorSet.colorText2 }}>
              Step 02:
            </span>
            <span style={{ color: themeColorSet.colorText3 }}>Get started</span>
          </div>
          <div className='slide w-full flex justify-between mt-2 '>
            <span
              style={{
                width: '19.4%',
                height: '2px',
                backgroundColor: commonColor.colorGreen1,
                display: 'inline-block'
              }}></span>
            <span
              style={{
                width: '19.4%',
                height: '2px',
                backgroundColor: commonColor.colorBlue1,
                display: 'inline-block'
              }}></span>
            <span
              style={{
                width: '19.4%',
                height: '2px',
                backgroundColor: commonColor.colorGreen1,
                display: 'inline-block'
              }}></span>
            <span
              style={{
                width: '19.4%',
                height: '2px',
                backgroundColor: commonColor.colorGreen1,
                display: 'inline-block'
              }}></span>
            <span
              style={{
                width: '19.4%',
                height: '2px',
                backgroundColor: commonColor.colorGreen1,
                display: 'inline-block'
              }}></span>
          </div>
          <div
            className='text mt-4'
            style={{
              color: themeColorSet.colorText1,
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
            How would you like to get started?
          </div>
          <div className='option mt-5'>
            <div
              className='optionItem h-32 flex items-center pl-5 mb-3 cursor-pointer'
              style={{
                backgroundColor: themeColorSet.colorBg2
              }}
              onClick={handleChooseRadio1}>
              <Space className='content' size={15}>
                <span className='radioButton'>
                  <ConfigProvider theme={{ token: { colorBorder: themeColorSet.colorBg3 } }}>
                    <Radio value={1} checked={radio1} onClick={handleChooseRadio1} />
                  </ConfigProvider>
                </span>
                <span className='icon'>
                  <Avatar
                    className='messageButton'
                    shape='circle'
                    style={{ backgroundColor: themeColorSet.colorBg1 }}
                    icon={<FontAwesomeIcon icon={faPeopleGroup} color={commonColor.colorBlue1} />}
                    size={45}
                  />
                </span>
                <span className='contentText'>
                  <div className='top font-semibold' style={{ color: themeColorSet.colorText1 }}>
                    Connect with developers and the community
                  </div>
                  <div
                    className='bottom mt-2'
                    style={{
                      color: themeColorSet.colorText3,
                      fontSize: '0.9rem'
                    }}>
                    Explore communities and build your developers network.
                  </div>
                </span>
              </Space>
            </div>
            <div
              className='optionItem h-32 flex items-center pl-5 mb-3 cursor-pointer'
              style={{
                backgroundColor: themeColorSet.colorBg2
              }}
              onClick={handleChooseRadio2}>
              <Space className='content' size={15}>
                <span className='radioButton'>
                  <ConfigProvider theme={{ token: { colorBorder: themeColorSet.colorBg3 } }}>
                    <Radio value={2} checked={radio2} onClick={handleChooseRadio2} />
                  </ConfigProvider>
                </span>
                <span className='icon'>
                  <Avatar
                    className='messageButton'
                    style={{ backgroundColor: themeColorSet.colorBg1 }}
                    shape='circle'
                    icon={<FontAwesomeIcon icon={faBriefcase} color={commonColor.colorGreen1} />}
                    size={45}
                  />
                </span>
                <span className='contentText'>
                  <div className='top font-semibold' style={{ color: themeColorSet.colorText1 }}>
                    Connect with developers and the community
                  </div>
                  <div
                    className='bottom mt-2'
                    style={{
                      color: themeColorSet.colorText3,
                      fontSize: '0.9rem'
                    }}>
                    Set preferences and explorer jobs tailored for you.
                  </div>
                </span>
              </Space>
            </div>
          </div>

          <span className='btnNext absolute'>
            <ButtonActiveHover
              rounded
              onClick={() => {
                if (value === 0) {
                  error();
                  return;
                }
                dispatch(CHOOSE_GET_STARTED_SAGA(value));
                navigate('/select-interest');
              }}>
              Next
            </ButtonActiveHover>
          </span>
        </div>
      </div>
    </StyleProvider>
  );
};

export default GetStarted;
