import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider, Image, Input, Popover, Space, Upload, message } from 'antd';
import type { UploadFile } from 'antd/lib';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Picker from '@emoji-mart/react';
import {
  faFaceSmile,
  faMicrophone,
  faPaperPlane,
  faPaperclip,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

import merge from '@/util/mergeClassName';
import { getTheme } from '@/util/theme';
import { Socket } from '@/util/constants/SettingSystem';
import { imageService } from '@/services/ImageService';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { useSendMessage } from '@/hooks/mutation';
import { IEmoji, IMessage, IUserInfo } from '@/types';
import { commonColor } from '@/util/cssVariable';

interface IChatInput {
  conversationID: string;
  members: IUserInfo[];
  setHaveMedia: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInput: React.FC<IChatInput> = ({ conversationID, members, setHaveMedia }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const [messageApi, contextHolder] = message.useMessage();

  const [messageContent, setMessage] = useState('');
  const [cursor, setCursor] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [filesUpload, setFilesUpload] = useState<UploadFile<any>[]>([]);

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();

  const [id, setId] = useState(uuidv4().replace(/-/g, ''));

  const { mutateSendMessage } = useSendMessage();

  const handleSubmit = async (content: string) => {
    if (!conversationID) return;
    if (!content && !files.length) return;

    setMessage('');

    if (content.trim() !== '' || content.trim().length !== 0) {
      const message = {
        _id: id,
        conversation_id: conversationID,
        sender: {
          _id: currentUserInfo._id,
          user_image: currentUserInfo.user_image,
          name: currentUserInfo.name
        },
        isSending: true,
        content: content,
        createdAt: new Date()
      };

      setId(uuidv4().replace(/-/g, ''));
      mutateSendMessage(message as unknown as IMessage);
      chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });
      chatSocket.emit(Socket.STOP_TYPING, { conversationID, userID: currentUserInfo._id, members });
    }

    if (files.length > 0) {
      const newFiles = [...files];
      setFiles([]);
      const result = await handleUploadImage(newFiles);

      const newMessage = {
        _id: id + 'image',
        conversation_id: conversationID,
        images: result,
        sender: {
          _id: currentUserInfo._id,
          user_image: currentUserInfo.user_image,
          name: currentUserInfo.name
        },
        type: 'image',
        createdAt: new Date()
      };
      chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message: newMessage });
    }
  };

  const handleUploadImage = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const { data } = await imageService.uploadImages(formData);
    return data.metadata;
  };

  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      void messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  const checkEmpty =
    (messageContent.trim() === '' || messageContent.trim().length === 0) && files.length === 0;

  const handleStopTyping = useCallback(
    debounce(
      () => chatSocket.emit(Socket.STOP_TYPING, { conversationID, userID: currentUserInfo._id, members }),
      1000
    ),
    []
  );
  useEffect(() => {
    if (files.length > 0) {
      setHaveMedia(true);
    } else {
      setHaveMedia(false);
    }
  }, [files.length]);

  return (
    <div
      className={merge('footer flex justify-between', files.length > 0 ? 'items-end pb-2' : 'items-center')}
      style={{ height: files.length > 0 ? '18%' : '8%' }}>
      {contextHolder}
      <Popover
        className='text-center cursor-pointer'
        style={{ width: '5%' }}
        placement='top'
        trigger='click'
        content={
          <Picker
            data={async () => {
              const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

              return response.json();
            }}
            onEmojiSelect={(emoji: IEmoji) => {
              setCursor(cursor + emoji.native.length);
              setMessage(messageContent.slice(0, cursor) + emoji.native + messageContent.slice(cursor));
            }}
            theme={themeColorSet.colorPicker}
          />
        }>
        <FontAwesomeIcon
          className='item px-5'
          size='lg'
          icon={faFaceSmile}
          style={{ color: commonColor.colorBlue1 }}
        />
      </Popover>

      <div className='input relative top-0 left-0 z-0' style={{ width: '100%' }}>
        {files.length > 0 && (
          <div className='absolute list-image overflow-auto w-full h-20 flex px-4 pt-2 gap-5 z-10'>
            <Image.PreviewGroup>
              {files.map((file, index) => {
                return (
                  <div className='relative select-none' key={index}>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt='Preview' // preview image
                      className='rounded-sm min-h-[50px] min-w-[50px] max-h-[50px] max-w-[50px] object-cover'
                      width={50}
                      preview={false}
                    />
                    <FontAwesomeIcon
                      className='absolute block rounded-full -top-1 -right-1 w-4 h-4 cursor-pointer'
                      style={{ backgroundColor: themeColorSet.colorBg4 }}
                      icon={faXmark}
                      color={themeColorSet.colorText1}
                      onClick={() => {
                        setFiles(files.filter((_, i) => i !== index));
                        setFilesUpload(filesUpload.filter((_, i) => i !== index));
                      }}
                    />
                  </div>
                );
              })}
            </Image.PreviewGroup>
          </div>
        )}
        <ConfigProvider theme={{ token: { controlHeight: 35, lineWidth: 0 } }}>
          <Input
            allowClear
            className={merge('rounded-3xl', files.length > 0 && 'pt-24')}
            placeholder='Write a message'
            value={messageContent}
            onKeyUp={(e) => {
              // get cursor position
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition ?? 0);
            }}
            onClick={(e) => {
              // get cursor position
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition ?? 0);
            }}
            onChange={(e) => {
              chatSocket.emit(Socket.IS_TYPING, {
                conversationID,
                userID: currentUserInfo._id,
                members
              });
              setMessage(e.currentTarget.value);
              handleStopTyping();
              // get cursor position
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition ?? 0);
            }}
            onPressEnter={() => handleSubmit(messageContent)}
            suffix={
              <span
                className={merge(
                  'transition-colors duration-300',
                  checkEmpty
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:text-blue-700 hover:scale-110 cursor-pointer'
                )}
                onClick={() => handleSubmit(messageContent)}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
            }
          />
        </ConfigProvider>
      </div>
      <Space className='extension flex justify-center items-center' style={{ width: '12%' }}>
        <Upload
          // maxCount={5}
          multiple
          customRequest={({ onSuccess }) => {
            if (onSuccess) onSuccess('done');
          }}
          showUploadList={false}
          listType='picture'
          beforeUpload={beforeUpload}
          fileList={filesUpload}
          onChange={(info) => {
            setFilesUpload(info.fileList);
            setFiles(info.fileList.map((file) => file.originFileObj as File));
          }}>
          <FontAwesomeIcon
            className='item mr-3'
            size='lg'
            icon={faPaperclip}
            style={{ color: commonColor.colorBlue1 }}
          />
        </Upload>
        <div className='micro'>
          <FontAwesomeIcon
            className='item ml-3'
            size='lg'
            icon={faMicrophone}
            style={{ color: commonColor.colorBlue1 }}
          />
        </div>
      </Space>
    </div>
  );
};

export default ChatInput;
