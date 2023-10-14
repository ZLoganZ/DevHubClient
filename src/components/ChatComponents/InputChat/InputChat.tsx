import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider, Input, Popover, Space } from 'antd';
import { useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import { faFaceSmile, faMicrophone, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import { getTheme } from '@/util/theme';
import { PRIVATE_MSG } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import UploadComponent from '@/components/UploadComponent';
import { useAppSelector } from '@/hooks/special';
import { useCurrentUserInfo } from '@/hooks/fetch';
import { MessageType, UserInfoType } from '@/types';

interface Props {
  conversationID: string;
  messagesState: MessageType[];
  setMessagesState: (messages: MessageType[]) => void;
  setSeenState: (seen: UserInfoType[]) => void;
}

const InputChat: React.FC<Props> = ({ conversationID, messagesState, setMessagesState, setSeenState }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const [message, setMessage] = useState('');
  const [cursor, setCursor] = useState(0);

  const { currentUserInfo } = useCurrentUserInfo();

  useEffect(() => {
    if (conversationID && currentUserInfo) {
      chatSocket.on(PRIVATE_MSG + conversationID, (data: MessageType) => {
        // newMessage is data
        setMessagesState([...messagesState, data]);
        setSeenState([]);
      });
    }
  }, [conversationID, currentUserInfo, messagesState]);

  const handleSubmit = async (content: string) => {
    if (!conversationID) return;
    if (!content) return;

    setMessage('');

    chatSocket.emit(PRIVATE_MSG, {
      conversationID: conversationID,
      message: {
        _id: Math.random().toString(36).substring(7),
        sender: {
          _id: currentUserInfo._id,
          user_image: currentUserInfo.user_image,
          name: currentUserInfo.name
        },
        content: content,
        createdAt: new Date()
      }
    });
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
