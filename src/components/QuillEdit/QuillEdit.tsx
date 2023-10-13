import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { getTheme } from '@/util/theme';
import textToHTMLWithAllSpecialCharacter from '@/util/textToHTML';
import { closeModal, setHandleSubmit } from '@/redux/Slice/ModalHOCSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssQuillEdit';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link']
];

interface QuillEditProps {
  placeholder: string;
  content: string;
  callbackFunction: (value: string) => void;
}

const QuillEdit: React.FC<QuillEditProps> = ({ placeholder, callbackFunction, content }) => {
  const dispatch = useAppDispatch();
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const [value, setValue] = useState<any>(content);

  const ReactQuillRef = useRef<any>();

  useEffect(() => {
    const quill = ReactQuillRef.current?.getEditor();

    quill.root.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData!.getData('text/plain');

      // Instead parse and insert HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(textToHTMLWithAllSpecialCharacter(text), 'text/html');

      document.getSelection()?.getRangeAt(0).insertNode(doc.body);
    });
  }, []);

  // Kiểm tra nội dung của value để set callback
  const handleQuillChangeValue = () => {
    const HTML = new DOMParser().parseFromString(value, 'text/html').body.innerText;
    if (HTML === '') callbackFunction('');
    else callbackFunction(value);
    dispatch(closeModal());
  };

  useEffect(() => {
    // Dispatch callback submit lên cho ModalHOC
    dispatch(setHandleSubmit(handleQuillChangeValue));
  }, [value]);

  return (
    <StyleProvider theme={themeColorSet}>
      <ReactQuill
        ref={ReactQuillRef as React.LegacyRef<ReactQuill>}
        value={value}
        preserveWhitespace
        onChange={setValue}
        modules={{
          toolbar: toolbarOptions
        }}
        placeholder={placeholder || 'Add a Content'}
        theme='snow'
      />
    </StyleProvider>
  );
};

export default QuillEdit;
