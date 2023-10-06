import { Avatar, Button, ConfigProvider, Input, message, Popover, Upload } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
// import { sha1 } from 'crypto-hash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
// import { sha1 } from 'crypto-hash';
import { useMediaQuery } from 'react-responsive';

import { ButtonActiveHover } from '@/components/MiniComponent';
import { commonColor } from '@/util/cssVariable';
import { getTheme } from '@/util/theme';
import textToHTMLWithAllSpecialCharacter from '@/util/textToHTML';
import { useCreatePost } from '@/hooks/mutation';
import { useAppSelector } from '@/hooks/special';
import { UserInfoType } from '@/types';
import StyleProvider from './cssNewPost';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link']
];

interface Props {
  currentUser: UserInfoType;
}

//===================================================

const NewPost = ({ currentUser }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { mutateCreatePost, isLoadingCreatePost, isSuccessCreatePost, isErrorCreatePost } = useCreatePost();

  const [random, setRandom] = useState(0);

  const [file, setFile]: any = useState(null);

  const [content, setContent] = useState('');

  const ReactQuillRef = useRef<any>();

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

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

  // Hàm hiển thị mesage
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Please enter the content'
    });
  };

  const form = useForm({
    defaultValues: {
      title: '',
      linkImage: null
    }
  });

  const onSubmit = async (values: any) => {
    if (content === '<p><br></p>' || content === '<p></p>') {
      error();
    } else {
      const result = await handleUploadImage(file);
      if (result.status === 'done') {
        mutateCreatePost({
          title: values.title,
          content: content,
          img: result.url
        });
      }
    }
  };

  useEffect(() => {
    if (isSuccessCreatePost) {
      setContent('');
      setRandom(Math.random());
      setFile(null);
      form.setValue('title', '');
      form.setValue('linkImage', null);
      messageApi.success('Create post successfully');
    }

    if (isErrorCreatePost) {
      messageApi.error('Create post failed');
    }
  }, [isSuccessCreatePost, isErrorCreatePost]);

  const handleUpload = (info: any) => {
    if (info.fileList.length === 0) return;

    setFile(info?.fileList[0]?.originFileObj);
    form.setValue('linkImage', info?.fileList[0]?.originFileObj);
  };

  const handleUploadImage = async (file: RcFile) => {
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

  // const handleRemoveImage = async () => {
  //   form.setValue('linkImage', null);
  //   const formData = new FormData();
  //   const public_id = file.public_id;
  //   formData.append('api_key', '235531261932754');
  //   formData.append('public_id', public_id);
  //   const timestamp = String(Date.now());
  //   formData.append('timestamp', timestamp);
  //   const signature = await sha1(`public_id=${public_id}&timestamp=${timestamp}qb8OEaGwU1kucykT-Kb7M8fBVQk`);
  //   formData.append('signature', signature);
  //   const res = await fetch('https://api.cloudinary.com/v1_1/dp58kf8pw/image/destroy', {
  //     method: 'POST',
  //     body: formData
  //   });
  //   const data = await res.json();
  //   setFile(data);
  // };

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
          <div
            className='newPostHeader text-center text-xl font-bold'
            style={{ color: themeColorSet.colorText1 }}>
            Create Post
          </div>
          <div className='newPostBody'>
            <div className='name_avatar flex items-center'>
              <Avatar
                size={isXsScreen ? 40 : 50}
                src={currentUser.user_image || './images/DefaultAvatar/default_avatar.png'}
              />
              <div className='name font-bold ml-2'>
                <NavLink to={`/user/${currentUser._id}`}>{currentUser.name}</NavLink>
              </div>
            </div>
            <div className='AddTitle mt-4 z-10'>
              <Input
                key={random}
                name='title'
                placeholder='Add a Title'
                autoComplete='off'
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
                title={'Emoji'}
                content={
                  <Picker
                    theme={themeColorSet.colorPicker}
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
                  accept='image/*'
                  key={random}
                  maxCount={1}
                  customRequest={async ({ onSuccess }: any) => {
                    onSuccess('ok');
                  }}
                  data={() => {
                    return {};
                  }}
                  listType='picture'
                  onChange={handleUpload}
                  onRemove={() => {
                    setFile(null);
                  }}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </span>
            </div>
            <div className='newPostFooter__right'>
              <ButtonActiveHover rounded onClick={form.handleSubmit(onSubmit)} loading={isLoadingCreatePost}>
                <span style={{ color: commonColor.colorWhile1 }}>
                  {isLoadingCreatePost ? 'Creating..' : 'Create'}
                </span>
              </ButtonActiveHover>
            </div>
          </div>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default NewPost;
