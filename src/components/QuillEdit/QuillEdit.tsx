import { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import { ConfigProvider } from 'antd';
import ImageCompress from 'quill-image-compress';
import 'react-quill/dist/quill.snow.css';

import { getTheme } from '@/util/theme';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleTotal from './cssQuillEdit';

Quill.register('modules/imageCompress', ImageCompress);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'clean'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link']
];

interface QuillEditProps {
  placeholder: string;
  content: string;
  callbackFunction: (value: string) => void;
}

const QuillEdit = (Props: QuillEditProps) => {
  const dispatch = useAppDispatch();
  const searchRef = useRef<any>(null);
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const [value, setValue] = useState<any>(Props.content);

  // Quill Editor
  let [quill, setQuill] = useState<any>(null);

  useEffect(() => {
    // Tạo quill
    quill = new Quill('#editorDrawer', {
      placeholder: Props.placeholder,
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow',
      scrollingContainer: '#scrolling-container'
    });
    quill.on('text-change', function () {
      if (searchRef.current) {
        clearTimeout(searchRef.current);
      }
      searchRef.current = setTimeout(() => {
        handleQuillChange();
      }, 300);
    });

    // Ngăn chặn paste text vào quill
    // C1
    quill.root.addEventListener('paste', (event: any) => {
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');

      const textToHTMLWithTabAndSpace = text
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/ /g, '&nbsp;');

      document.execCommand('insertHTML', false, textToHTMLWithTabAndSpace);
    });

    setQuill(quill);
  }, []);

  useEffect(() => {
    // Hiển thị nội dung trong quill
    quill.root.innerHTML = Props.content;
    setQuill(quill);
  }, [Props, quill]);

  // Kiểm tra nội dung của value để set callback
  const handleQuillChangeValue = () => {
    const HTML = new DOMParser().parseFromString(value, 'text/html').body
      .innerText;
    if (HTML === '') Props.callbackFunction('');
    else Props.callbackFunction(value);
    dispatch(closeModal());
  };

  useEffect(() => {
    // Dispatch callback submit lên cho ModalHOC
    dispatch(setHandleSubmit(handleQuillChangeValue));
  }, [value]);

  const handleQuillChange = () => {
    const text = quill.root.innerHTML;
    setValue(text);
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div id="editorDrawer" />
      </StyleTotal>
    </ConfigProvider>
  );
};

export default QuillEdit;
