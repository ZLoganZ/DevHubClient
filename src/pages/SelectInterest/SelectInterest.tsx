import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import descArray from '@/util/Descriptions/Tags';
import { ButtonActiveHover } from '@/components/MiniComponent';

import { CHOOSE_GET_INTEREST_SAGA } from '@/redux/ActionSaga/GetStartedActionSaga';
import { commonColor } from '@/util/cssVariable';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssSelectInterest';

const SelectInterest = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const addArray: string[] = [];

  // Hàm hiển thị mesage
  const error = () => {
    void messageApi.open({
      type: 'error',
      content: 'Please choose at least 5 interest to get started'
    });
  };

  return (
    <StyleProvider theme={themeColorSet}>
      {contextHolder}
      <div className='flex justify-center w-full h-full selectInterest'>
        <div className='content w-1/2 pt-10 h-full relative'>
          <div>
            <span className='mr-3' style={{ color: themeColorSet.colorText2 }}>
              Step 03:
            </span>
            <span style={{ color: themeColorSet.colorText3 }}>Select interest</span>
          </div>
          <div className='slide w-full flex justify-between mt-2'>
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
          </div>
          <div
            className='textMax mt-4'
            style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: themeColorSet.colorText1
            }}>
            Select your interest
          </div>
          <div
            className='textMin mt-5'
            style={{
              fontSize: '1rem',
              color: themeColorSet.colorText3
            }}>
            Choose at least 5 interest to get started
          </div>
          <div className='interest mt-7'>
            <div className='flex flex-wrap'>
              {descArray.map((item, index) => (
                <div
                  className='interestItem px-4 py-2 mr-2 mb-3'
                  key={index}
                  onClick={(e) => {
                    if (e.currentTarget.classList.contains('active')) {
                      e.currentTarget.classList.remove('active');
                      addArray.splice(addArray.indexOf(item.title), 1);
                      return;
                    } else {
                      e.currentTarget.classList.add('active');
                      addArray.push(item.title);
                      return;
                    }
                  }}>
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          <div className='btnNext absolute'>
            <ButtonActiveHover
              onClick={() => {
                if (addArray.length < 5) {
                  error();
                  return;
                }
                dispatch(
                  CHOOSE_GET_INTEREST_SAGA({
                    des: addArray
                  })
                );
                navigate('/select-community');
              }}>
              Next
            </ButtonActiveHover>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export default SelectInterest;
