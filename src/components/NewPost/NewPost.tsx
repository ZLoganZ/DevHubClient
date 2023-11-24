import { Avatar, Button, ConfigProvider, Input, message, Popover, Upload } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Picker from '@emoji-mart/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadOutlined } from '@ant-design/icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';

import { ButtonActiveHover } from '@/components/MiniComponent';
import { commonColor } from '@/util/cssVariable';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { textToHTML } from '@/util/convertText';
import { toolbarOptions } from '@/util/constants/SettingSystem';
import { useCreatePost } from '@/hooks/mutation';
import { useAppSelector } from '@/hooks/special';
import { IEmoji, IUserInfo } from '@/types';
import { imageService } from '@/services/ImageService';
import StyleProvider from './cssNewPost';

interface INewPost {
  currentUser: IUserInfo;
}

//===================================================

const NewPost: React.FC<INewPost> = ({ currentUser }) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { mutateCreatePost, isSuccessCreatePost, isErrorCreatePost } = useCreatePost();

  const [random, setRandom] = useState(uuidv4().replace(/-/g, ''));

  const [file, setFile] = useState<File>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoadingCreatePost, setIsLoadingCreatePost] = useState(false);

  const ReactQuillRef = useRef<ReactQuill | null>(null);

  const isXsScreen = useMediaQuery({ maxWidth: 639 });

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

  // Hàm hiển thị mesage
  const error = () => {
    void messageApi.open({
      type: 'error',
      content: 'Please enter the content'
    });
  };

  const onSubmit = useCallback(async () => {
    if (content === '<p><br></p>' || content === '<p></p>' || content === '') {
      error();
    } else {
      setIsLoadingCreatePost(true);
      const formData = new FormData();
      if (file) {
        const result = await handleUploadImage(file);
        formData.append('image', result.url);
      }

      mutateCreatePost(
        {
          title: title,
          content: content,
          images: [formData.get('image')!.toString()]
        },
        {
          onSettled: () => {
            setIsLoadingCreatePost(false);
          }
        }
      );
    }
  }, [content, file]);

  useEffect(() => {
    if (isSuccessCreatePost) {
      setContent('');
      setRandom(uuidv4().replace(/-/g, ''));
      setFile(undefined);

      void messageApi.success('Create post successfully');
    } else if (isErrorCreatePost) {
      void messageApi.error('Create post failed');
    }
  }, [isSuccessCreatePost, isErrorCreatePost]);

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await imageService.uploadImage(formData);
    return {
      url: data.metadata.key,
      status: 'done'
    };
  };

  // const handleUploadImages = async (files: File[]) => {
  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append('images', file);
  //   });
  //   const { data } = await imageService.uploadImages(formData);
  //   return {
  //     url: data.metadata,
  //     status: 'done'
  //   };
  // };

  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      void messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  return (
    <ConfigProvider theme={{ token: { controlHeight: 40, borderRadius: 0, lineWidth: 0 } }}>
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
              <Avatar size={isXsScreen ? 40 : 50} src={getImageURL(currentUser.user_image, 'avatar_mini')} />
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
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className='AddContent mt-4'>
              <ReactQuill
                ref={ReactQuillRef}
                value={content}
                onChange={setContent}
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
                  accept='image/png, image/jpeg, image/jpg'
                  key={random}
                  maxCount={5}
                  customRequest={({ onSuccess }) => {
                    if (onSuccess) onSuccess('ok');
                  }}
                  multiple
                  listType='picture'
                  beforeUpload={beforeUpload}
                  onChange={(info) => setFile(info.file.originFileObj)}
                  onRemove={() => {
                    setFile(undefined);
                  }}>
                  <Button icon={<UploadOutlined />}>Upload (Max: 5)</Button>
                </Upload>
              </span>
            </div>
            <div className='newPostFooter__right'>
              <ButtonActiveHover type='primary' onClick={onSubmit} loading={isLoadingCreatePost}>
                <span style={{ color: commonColor.colorWhite1 }}>
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
