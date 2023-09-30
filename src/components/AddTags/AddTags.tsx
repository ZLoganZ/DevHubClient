import { useEffect, useState } from 'react';

import StyleProvider from './cssAddTags';
import { getTheme } from '@/util/theme';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import descArrays from '@/util/Descriptions/Tags';
import { useAppDispatch, useAppSelector } from '@/hooks/special';

interface Props {
  tags: string[];
  callback: (tags: string[]) => void;
}

const AddTags = (Props: Props) => {
  const dispatch = useAppDispatch();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
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
    <StyleProvider theme={themeColorSet}>
      <div className='flex flex-wrap'>
        {descArray.map((item, index) => (
          <span
            key={index}
            className={
              addTagArr.indexOf(item.title) !== -1
                ? 'itemAddTag mx-2 my-2 px-4 py-2 active'
                : 'itemAddTag mx-2 my-2 px-4 py-2'
            }
            onClick={() => {
              if (addTagArr.includes(item.title)) {
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
            <span className='mr-2'>{item.svg}</span>
            <span>{item.title}</span>
          </span>
        ))}
      </div>
    </StyleProvider>
  );
};

export default AddTags;
