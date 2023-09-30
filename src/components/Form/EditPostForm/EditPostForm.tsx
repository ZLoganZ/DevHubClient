import { Button, ConfigProvider, Input, message, Popover, Upload, UploadFile } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState, useMemo, useRef } from 'react';
import { sha1 } from 'crypto-hash';
import { useForm } from 'react-hook-form';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';

import { callBackSubmitDrawer } from '@/redux/Slice/DrawerHOCSlice';
import { getTheme } from '@/util/theme';
import { useUpdatePost } from '@/hooks/mutation';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssEditPostForm';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link']
];

interface PostProps {
  id: string;
  title: string;
  content: string;
  img?: string;
}

const EditPostForm = (PostProps: PostProps) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateUpdatePost } = useUpdatePost();

  const [content, setContent] = useState(PostProps.content);

  const ReactQuillRef = useRef<any>();

  const handleUploadImage = async (file: RcFile | string) => {
    if (!file)
      return {
        url: null,
        status: 'done'
      };

    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/upload?upload_preset=mysoslzj', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return {
      url: data.secure_url,
      status: 'done'
    };
  };

  const handleRemoveImage = async (imageURL: string) => {
    const nameSplit = imageURL.split('/');
    const duplicateName = nameSplit.pop();

    // Remove .
    const public_id = duplicateName?.split('.').slice(0, -1).join('.');

    const formData = new FormData();
    formData.append('api_key', '235531261932754');
    formData.append('public_id', public_id!);
    const timestamp = String(Date.now());
    formData.append('timestamp', timestamp);
    const signature = await sha1(`public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`);
    formData.append('signature', signature);
    const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return {
      url: data,
      status: 'done'
    };
  };

  const form = useForm({
    defaultValues: {
      title: PostProps.title,
      img: PostProps.img
    }
  });

  const onSubmit = async (values: any) => {
    if (content === '<p><br></p>') {
      error();
    } else {
      if (form.getValues('img') !== PostProps.img) {
        if (form.getValues('img')) {
          const result = await handleUploadImage(form.getValues('img')!);
          form.setValue('img', result.url);
        }
        if (PostProps.img) await handleRemoveImage(PostProps.img);
      }
      values.img = form.getValues('img');

      mutateUpdatePost({
        id: PostProps.id,
        postUpdate: values
      });
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  useEffect(() => {
    const quill = ReactQuillRef.current?.getEditor();
    quill.root.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData!.getData('text/plain');

      const textToHTMLWithTabAndSpace = text
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/ /g, '&nbsp;');

      // Instead parse and insert HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(textToHTMLWithTabAndSpace, 'text/html');

      document.getSelection()?.getRangeAt(0).insertNode(doc.body);
    });

    // Dispatch callback submit lên cho DrawerHOC
    dispatch(callBackSubmitDrawer(form.handleSubmit(onSubmit)));
  }, []);

  // Hàm hiển thị mesage
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Please enter the content'
    });
  };

  const nameImage = useMemo(() => {
    if (PostProps.img) {
      const nameSplit = PostProps.img.split('/');
      const duplicateName = nameSplit.pop();
      const name = duplicateName?.replace(/_[^_]*\./, '.');
      return name;
    }
    return undefined;
  }, [PostProps.img]);

  const handleUpload = (info: any) => {
    form.setValue('img', info?.fileList[0]?.originFileObj);
  };

  const fileList: UploadFile[] = [
    {
      uid: '-1',
      name: nameImage!,
      status: 'done',
      url: PostProps.img
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 40,
          borderRadius: 0,
          lineWidth: 0
        }
      }}>
      {contextHolder}
      <StyleProvider theme={themeColorSet} className='rounded-lg mb-4'>
        <div className='newPost px-4 py-3'>
          <div className='newPostBody'>
            <div className='AddTitle mt-4 z-10'>
              <Input
                name='title'
                placeholder='Add a Title'
                defaultValue={PostProps.title}
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
                ref={ReactQuillRef as React.LegacyRef<ReactQuill>}
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: toolbarOptions
                }}
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
                title={'Members'}
                content={
                  <Picker
                    data={async () => {
                      const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

                      return response.json();
                    }}
                    onEmojiSelect={(emoji: any) => {
                      ReactQuillRef!.current?.getEditor().focus();
                      ReactQuillRef!.current
                        ?.getEditor()
                        .insertText(ReactQuillRef!.current?.getEditor().getSelection().index, emoji.native);
                    }}
                  />
                }>
                <span className='emoji'>
                  <FontAwesomeIcon className='item mr-3 ml-3' size='lg' icon={faFaceSmile} />
                </span>
              </Popover>
              <span>
                <Upload
                  name='img'
                  listType='picture'
                  onChange={handleUpload}
                  accept='image/png, image/jpeg, image/jpg'
                  defaultFileList={PostProps.img ? [...fileList] : []}
                  maxCount={1}
                  customRequest={async ({ onSuccess }) => {
                    if (onSuccess) {
                      onSuccess('ok');
                    }
                  }}
                  beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
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
