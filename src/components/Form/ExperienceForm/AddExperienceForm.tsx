import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTheme } from '../../../util/functions/ThemeFunction';
import { ConfigProvider, DatePicker, message } from 'antd';
import StyleTotal from './cssAddExperienceForm';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { closeModal, setHandleSubmit } from '../../../redux/Slice/ModalHOCSlice';

interface EditProps {
  experiences: any;
  setExperiences: any;
}

const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);
const dateFormat = 'MM/YYYY';

const AddExperienceForm = (Props: EditProps) => {
  const dispatch = useDispatch();
  const searchRef = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: any) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [positionName, setPositionName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pastDate, setPastDate] = useState('');

  const [untilNow, setUntilNow] = useState(false);
  const [disablePicker, setDisablePicker] = useState<[boolean, boolean]>([false, false]);

  // Hàm hiển thị mesage
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Please fill in all fields',
    });
  };

  const experience = {
    positionName: '',
    companyName: '',
    startDate: '',
    endDate: '',
  };

  const handleSetExperience = (e: any) => {
    e.preventDefault();
    if (positionName === '' || companyName === '' || startDate === '' || endDate === '') {
      // console.log('positionName', positionName);
      // console.log('companyName', companyName);
      // console.log('startDate', startDate);
      // console.log('endDate', endDate);
      error();
      return;
    } else {
      Props.setExperiences([...Props.experiences, experience]);
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    experience.positionName = positionName;
    experience.companyName = companyName;
    experience.startDate = startDate;
    experience.endDate = endDate;

    dispatch(setHandleSubmit(handleSetExperience));
  }, [positionName, companyName, startDate, endDate]);

  return (
    <ConfigProvider
      theme={{
        token: themeColor,
      }}
    >
      {contextHolder}
      <StyleTotal theme={themeColorSet}>
        <div className="editPositionForm">
          <div className="flex justify-between">
            <div className="PositionName form__group field" style={{ width: '48%' }}>
              <input
                //   defaultValue={}
                pattern="[A-Za-z ]*"
                type="input"
                className="form__field"
                placeholder="Position Name"
                name="positionName"
                id="positionName"
                required
                onChange={(e) => {
                  if (searchRef.current) {
                    clearTimeout(searchRef.current);
                  }
                  searchRef.current = setTimeout(() => {
                    setPositionName(e.target.value);
                  }, 300);
                }}
                autoComplete="off"
              />
              <label htmlFor="positionName" className="form__label">
                Position Name
              </label>
            </div>
            <div className="CompanyName form__group field" style={{ width: '48%' }}>
              <input
                //   defaultValue={}
                pattern="[A-Za-z ]*"
                type="input"
                className="form__field"
                placeholder="Company Name"
                name="companyName"
                id="companyName"
                required
                onChange={(e) => {
                  if (searchRef.current) {
                    clearTimeout(searchRef.current);
                  }
                  searchRef.current = setTimeout(() => {
                    setCompanyName(e.target.value);
                  }, 300);
                }}
                autoComplete="off"
              />
              <label htmlFor="companyName" className="form__label">
                Company Name
              </label>
            </div>
          </div>
          <div className="mt-7">
            <RangePicker
              picker="month"
              format={dateFormat}
              disabled={disablePicker}
              disabledDate={(current) => {
                return current && current > dayjs().endOf('day');
              }}
              size="large"
              onChange={(value, dateString) => {
                setStartDate(dateString[0]);
                untilNow ? setEndDate('Now') : setEndDate(dateString[1]);
                setPastDate(dateString[1]);
              }}
            />
            <button
              className="untilButton ml-8 px-4 py-2 rounded-md"
              onClick={(e) => {
                if (!untilNow) {
                  e.currentTarget.classList.add('untilActive');
                  setEndDate('Now');
                  setDisablePicker([false, true]);
                  setUntilNow(true);
                } else {
                  e.currentTarget.classList.remove('untilActive');
                  setEndDate(pastDate);
                  setDisablePicker([false, false]);
                  setUntilNow(false);
                }
              }}
            >
              Until Now
            </button>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default AddExperienceForm;
