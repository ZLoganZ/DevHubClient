import { Button, ConfigProvider, Input, message, Popover, Upload, UploadFile } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadOutlined } from '@ant-design/icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';

import { callBackSubmitDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { textToHTML } from '@/util/convertText';
import { toolbarOptions } from '@/util/constants/SettingSystem';
import { useUpdatePost } from '@/hooks/mutation';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { imageService } from '@/services/ImageService';
import { IEmoji } from '@/types';
import StyleProvider from './cssEditPostForm';

interface IEditPost {
  id: string;
  title: string;
  content: string;
  image?: string[];
}

const EditPostForm: React.FC<IEditPost> = ({ id, title, content, image }) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { mutateUpdatePost } = useUpdatePost();

  const [contentQuill, setContentQuill] = useState(content);
  const [imageFile, setImageFile] = useState<File>();

  useEffect(() => {
    setContentQuill(contentQuill);
  }, []);

  const ReactQuillRef = useRef<ReactQuill | null>(null);

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await imageService.uploadImage(formData);
    return {
      url: data.metadata.key,
      status: 'done'
    };
  };

  const form = useForm({
    defaultValues: {
      title: title
    }
  });

  const onSubmit = async (values: { title: string }) => {
    if (contentQuill === '<p><br></p>') {
      error();
    } else {
      const formdata = new FormData();
      dispatch(setLoading(true));
      if (imageFile) {
        const result = await handleUploadImage(imageFile);
        formdata.append('image', result.url);

        // if (image) await handleRemoveImage(image);
      }

      mutateUpdatePost({
        id: id,
        postUpdate: { ...values, content: contentQuill, image: formdata.get('image')?.toString() }
      });
    }
  };

  const beforeUpload = (file: File, FileList: File[]) => {
    if (FileList.length > 5) {
      void messageApi.error('You can only upload 5 images at a time!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      void messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  useEffect(() => {
    const quill = ReactQuillRef.current?.getEditor()!;
    quill.root.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData!.getData('text/plain');

      // Instead parse and insert HTML
      const doc = new DOMParser().parseFromString(textToHTML(text), 'text/html');

      document.getSelection()!.getRangeAt(0).insertNode(doc.body);
    });
  }, []);

  useEffect(() => {
    // Dispatch callback submit lên cho DrawerHOC
    dispatch(callBackSubmitDrawer(form.handleSubmit(onSubmit)));
  }, [contentQuill, form, imageFile]);

  // Hàm hiển thị mesage
  const error = () => {
    void messageApi.open({
      type: 'error',
      content: 'Please enter the content'
    });
  };

  const fileList: UploadFile[] = [
    {
      uid: '-1',
      name: image![0],
      status: 'done',
      url: getImageURL(image![0], 'post_mini')
    }
  ];

  return (
    <ConfigProvider theme={{ token: { controlHeight: 40, borderRadius: 0, lineWidth: 0 } }}>
      {contextHolder}
      <StyleProvider theme={themeColorSet} className='rounded-lg mb-4'>
        <div className='newPost px-4 py-3'>
          <div className='newPostBody'>
            <div className='AddTitle mt-4 z-10'>
              <Input
                name='title'
                placeholder='Add a Title'
                defaultValue={title}
                allowClear
                style={{ borderColor: themeColorSet.colorText3 }}
                maxLength={150}
                onChange={(e) => {
                  form.setValue('title', e.target.value);
                }}
              />
            </div>
            <div className='AddContent mt-4'>
              <ReactQuill
                ref={ReactQuillRef}
                value={contentQuill}
                onChange={setContentQuill}
                modules={{ toolbar: toolbarOptions }}
                placeholder='Add a Content'
                theme='snow'
              />
            </div>
          </div>
          <div className='newPostFooter mt-3 flex justify-between items-center'>
            <div className='newPostFooter__left'>
              <Popover
                placement='top'
                trigger='click'
                content={
                  <Picker
                    theme={themeColorSet.colorPicker}
                    data={async () => {
                      const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

                      return response.json();
                    }}
                    onEmojiSelect={(emoji: IEmoji) => {
                      ReactQuillRef.current
                        ?.getEditor()
                        .insertText(
                          ReactQuillRef.current?.getEditor().getSelection(true).index,
                          emoji.native
                        );
                    }}
                  />
                }>
                <span className='emoji'>
                  <FontAwesomeIcon className='item mr-3 ml-3' size='lg' icon={faFaceSmile} />
                </span>
              </Popover>
              <span>
                <Upload
                  name='image'
                  listType='picture'
                  onChange={(info) => setImageFile(info.file.originFileObj)}
                  accept='image/png, image/jpeg, image/jpg'
                  defaultFileList={image ? [...fileList] : []}
                  maxCount={5}
                  customRequest={({ onSuccess }) => {
                    if (onSuccess) onSuccess('ok');
                  }}
                  beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Upload (Max: 5)</Button>
                </Upload>
              </span>
            </div>
          </div>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default EditPostForm;
