import { DatePicker, message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { getTheme } from '@/util/theme';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { IExperience } from '@/types';
import StyleProvider from './cssAddExperienceForm';

interface IEditExperience {
  experiences: IExperience[];
  setExperiences: React.Dispatch<React.SetStateAction<IExperience[]>>;
}

const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);
const dateFormat = 'MM/YYYY';

const AddExperienceForm: React.FC<IEditExperience> = ({ experiences, setExperiences }) => {
  const dispatch = useAppDispatch();
  const searchRef = useRef<NodeJS.Timeout>();
  const [messageApi, contextHolder] = message.useMessage();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const [position_name, setPositionName] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [pastDate, setPastDate] = useState('');

  const [untilNow, setUntilNow] = useState(false);
  const [disablePicker, setDisablePicker] = useState<[boolean, boolean]>([false, false]);

  // Hàm hiển thị mesage
  const error = () => {
    void messageApi.open({
      type: 'error',
      content: 'Please fill in all fields'
    });
  };

  const experience = {
    position_name: '',
    company_name: '',
    start_date: '',
    end_date: ''
  };

  const handleSetExperience = () => {
    if (position_name === '' || company_name === '' || start_date === '' || end_date === '') {
      error();
      return;
    } else {
      setExperiences([...experiences, experience]);
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    experience.position_name = position_name;
    experience.company_name = company_name;
    experience.start_date = start_date;
    experience.end_date = end_date;

    dispatch(setHandleSubmit(handleSetExperience));
  }, [position_name, company_name, start_date, end_date]);

  return (
    <StyleProvider theme={themeColorSet}>
      {contextHolder}
      <div className='editPositionForm'>
        <div className='flex justify-between'>
          <div className='PositionName form__group field' style={{ width: '48%' }}>
            <input
              //   defaultValue={}
              pattern='[A-Za-z ]*'
              type='input'
              className='form__field'
              placeholder='Position Name'
              name='position_name'
              id='position_name'
              required
              onChange={(e) => {
                if (searchRef.current) {
                  clearTimeout(searchRef.current);
                }
                searchRef.current = setTimeout(() => {
                  setPositionName(e.target.value);
                }, 300);
              }}
              autoComplete='off'
            />
            <label htmlFor='position_name' className='form__label'>
              Position Name
            </label>
          </div>
          <div className='CompanyName form__group field' style={{ width: '48%' }}>
            <input
              //   defaultValue={}
              pattern='[A-Za-z ]*'
              type='input'
              className='form__field'
              placeholder='Company Name'
              name='company_name'
              id='company_name'
              required
              onChange={(e) => {
                if (searchRef.current) {
                  clearTimeout(searchRef.current);
                }
                searchRef.current = setTimeout(() => {
                  setCompanyName(e.target.value);
                }, 300);
              }}
              autoComplete='off'
            />
            <label htmlFor='company_name' className='form__label'>
              Company Name
            </label>
          </div>
        </div>
        <div className='mt-7'>
          <RangePicker
            picker='month'
            format={dateFormat}
            disabled={disablePicker}
            disabledDate={(current) => {
              return current && current > dayjs().endOf('day');
            }}
            size='large'
            onChange={(_, dateString) => {
              setStartDate(dateString[0]);
              untilNow ? setEndDate('Now') : setEndDate(dateString[1]);
              setPastDate(dateString[1]);
            }}
          />
          <button
            className='untilButton ml-8 px-4 py-2 rounded-md'
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
            }}>
            Until Now
          </button>
        </div>
      </div>
    </StyleProvider>
  );
};

export default AddExperienceForm;
