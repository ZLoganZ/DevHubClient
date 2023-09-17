import { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import StyleTotal from './cssAddTagComponent';
import { getTheme } from '@/util/functions/ThemeFunction';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import descArrays from '@/components/GlobalSetting/ItemComponent/Description';
import { AppDispatch, RootState } from '@/redux/configStore';

interface Props {
  tags: string[];
  callback: (tags: string[]) => void;
}

const AddTagComponent = (Props: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const descArray = [...descArrays];

  const [addTagArr, setAddTagArr] = useState([...Props.tags]);

  let addTagArrTemp = [...addTagArr];

  const handleSubmit = () => {
    Props.callback(addTagArr);
    dispatch(closeModal());
  };

  useEffect(() => {
    dispatch(setHandleSubmit(handleSubmit));
  }, [addTagArr]);

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div className="flex flex-wrap">
          {descArray.map((item, index) => (
            <span
              key={index}
              className={
                addTagArr.indexOf(item.title) !== -1
                  ? 'itemAddTag mx-2 my-2 px-4 py-2 active'
                  : 'itemAddTag mx-2 my-2 px-4 py-2'
              }
              onClick={() => {
                if (addTagArr?.includes(item.title)) {
                  //   addTagArr.splice(addTagArr.indexOf(item.title), 1);
                  setAddTagArr(addTagArrTemp.filter((i) => i !== item.title));
                  return;
                } else {
                  //   addTagArr.push(item.title);
                  setAddTagArr([...addTagArr, item.title]);
                  addTagArrTemp = [...addTagArr, item.title];
                  return;
                }
              }}>
              <span className="mr-2">{item.svg}</span>
              <span>{item.title}</span>
            </span>
          ))}
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default AddTagComponent;
