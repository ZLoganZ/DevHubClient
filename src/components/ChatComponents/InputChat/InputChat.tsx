import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider, Input, Popover, Space } from 'antd';
import { useState } from 'react';
import Picker from '@emoji-mart/react';
import { faFaceSmile, faMicrophone, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import { getTheme } from '@/util/theme';
import { PRIVATE_MSG } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import UploadComponent from '@/components/UploadComponent';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { useSendMessage } from '@/hooks/mutation';
import { MessageType } from '@/types';

interface Props {
  conversationID: string;
}

const InputChat: React.FC<Props> = ({ conversationID }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const [message, setMessage] = useState('');
  const [cursor, setCursor] = useState(0);

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const { currentUserInfo } = useCurrentUserInfo();

  const [id, setId] = useState(Math.random().toString(36).substring(7));

  const { mutateSendMessage } = useSendMessage();

  const handleSubmit = async (content: string) => {
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

    chatSocket.emit(PRIVATE_MSG, {
      conversationID: message.conversation_id,
      message
    });

    setId(Math.random().toString(36).substring(7));
    mutateSendMessage(message as unknown as MessageType);
  };

  const handleUpload = async (error: any, result: any, widget: any) => {
    if (error) {
      widget.close({
        quiet: true
      });
      return;
    }

    await messageService.sendMessage({
      conversation_id: conversationID,
      image: result?.info?.secure_url
    });
  };

  const checkEmpty = () => {
    if (message === '') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      className='footer flex justify-between items-center'
      style={{
        height: '8%'
      }}>
      <div
        className='iconEmoji text-center'
        style={{
          width: '5%'
        }}>
        <Popover
          placement='top'
          trigger='click'
          title='Emoji'
          content={
            <Picker
              data={async () => {
                const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

                return response.json();
              }}
              onEmojiSelect={(emoji: any) => {
                setMessage(message.slice(0, cursor) + emoji.native + message.slice(cursor));
              }}
              theme={themeColorSet.colorPicker}
            />
          }>
          <span className='emoji'>
            <FontAwesomeIcon className='item mr-3 ml-3' size='lg' icon={faFaceSmile} />
          </span>
        </Popover>
      </div>
      <div
        className='input'
        style={{
          width: '100%'
        }}>
        <ConfigProvider
          theme={{
            token: {
              controlHeight: 32,
              lineWidth: 0
            }
          }}>
          <Input
            allowClear
            placeholder='Write a message'
            value={message}
            onKeyUp={(e) => {
              // get cursor position
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition || 0);
            }}
            onClick={(e) => {
              // get cursor position
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition || 0);
            }}
            onChange={(e) => {
              setMessage(e.currentTarget.value);
              // get cursor position
              const cursorPosition = e.currentTarget.selectionStart;
              setCursor(cursorPosition || 0);
            }}
            onPressEnter={(e) => {
              handleSubmit(e.currentTarget.value);
            }}
            suffix={
              <span
                className={`cursor-pointer hover:text-blue-700 ${
                  checkEmpty() ? 'text-gray-400 cursor-not-allowed' : 'transition-all duration-300'
                }`}
                onClick={() => handleSubmit(message)}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
            }
          />
        </ConfigProvider>
      </div>
      <Space
        className='extension flex justify-center items-center'
        style={{
          width: '12%'
        }}>
        <UploadComponent onUpload={handleUpload}>
          <div className='upload'>
            <FontAwesomeIcon className='item mr-3' size='lg' icon={faPaperclip} />
          </div>
        </UploadComponent>
        <div className='micro'>
          <FontAwesomeIcon className='item ml-3' size='lg' icon={faMicrophone} />
        </div>
      </Space>
    </div>
  );
};

export default InputChat;
