import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider, Input, Popover, Space, Upload, message } from 'antd';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Picker from '@emoji-mart/react';
import { faFaceSmile, faMicrophone, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

import merge from '@/util/mergeClassName';
import { getTheme } from '@/util/theme';
import { Socket } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import { imageService } from '@/services/ImageService';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { useSendMessage } from '@/hooks/mutation';
import { IEmoji, IMessage, IUserInfo } from '@/types';
import { commonColor } from '@/util/cssVariable';

interface IChatInput {
  conversationID: string;
  members: IUserInfo[];
}

const ChatInput: React.FC<IChatInput> = ({ conversationID, members }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const [messageApi, contextHolder] = message.useMessage();

  const [messageContent, setMessage] = useState('');
  const [cursor, setCursor] = useState(0);
  const [file, setFile] = useState<File>();

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();

  const [id, setId] = useState(uuidv4().replace(/-/g, ''));

  const { mutateSendMessage } = useSendMessage();

  const handleSubmit = (content: string) => {
    if (!conversationID) return;
    if (!content) return;

    setMessage('');

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

    chatSocket.emit(Socket.PRIVATE_MSG, { conversationID, message });

    chatSocket.emit(Socket.STOP_TYPING, { conversationID, userID: currentUserInfo._id, members });

    setId(uuidv4().replace(/-/g, ''));
    mutateSendMessage(message as unknown as IMessage);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) {
      const result = await handleUploadImage(file);
      formData.append('image', result.url);
    }
    await messageService.sendMessage({
      conversation_id: conversationID,
      content: messageContent,
      image: formData.get('image')?.toString()
    });
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await imageService.uploadImage(formData);
    return {
      url: data.metadata.key,
      status: 'done'
    };
  };

  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      void messageApi.error('Image must smaller than 3MB!');
    }
    return isLt2M;
  };

  const checkEmpty = (messageContent.trim() === '' || messageContent.trim().length === 0) && !file;

  const handleStopTyping = useCallback(
    debounce(
      () => chatSocket.emit(Socket.STOP_TYPING, { conversationID, userID: currentUserInfo._id, members }),
      1000
    ),
    []
  );
  return (
    <div className='footer flex justify-between items-center' style={{ height: '8%' }}>
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
      <div className='input' style={{ width: '100%' }}>
        <ConfigProvider theme={{ token: { controlHeight: 35, lineWidth: 0 } }}>
          <Input
            allowClear
            className='rounded-full'
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
                  'transition-all duration-300',
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
          maxCount={5}
          customRequest={({ onSuccess }) => {
            if (onSuccess) onSuccess('ok');
          }}
          showUploadList={false}
          listType='picture'
          beforeUpload={beforeUpload}
          onChange={(info) => setFile(info.file.originFileObj)}>
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
