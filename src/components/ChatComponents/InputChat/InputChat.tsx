import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider, Input, Popover, Space } from 'antd';
import { useState } from 'react';
import Picker from '@emoji-mart/react';
import { useSelector } from 'react-redux';
import {
  faFaceSmile,
  faMicrophone,
  faPaperclip
} from '@fortawesome/free-solid-svg-icons';

import { getTheme } from '@/util/functions/ThemeFunction';
import { messageService } from '@/services/MessageService';
import UploadComponent from '@/components/UploadComponent';
import { RootState } from '@/redux/configStore';

interface Props {
  conversationID: string;
}

const InputChat = (Props: Props) => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const [message, setMessage] = useState('');
  const [cursor, setCursor] = useState(0);

  const handleSubmit = async (data: any) => {
    if (!Props.conversationID) return;
    if (!data) return;
    setMessage('');
    await messageService.sendMessage({
      conversationID: Props.conversationID,
      body: data
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
      conversationID: Props.conversationID,
      image: result?.info?.secure_url
    });
  };

  return (
    <ConfigProvider>
      <div
        className="footer flex justify-between items-center"
        style={{
          height: '8%'
        }}>
        <div
          className="iconEmoji text-center"
          style={{
            width: '5%'
          }}>
          <Popover
            placement="top"
            trigger="click"
            title={'Emoji'}
            content={
              <Picker
                data={async () => {
                  const response = await fetch(
                    'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
                  );

                  return response.json();
                }}
                onEmojiSelect={(emoji: any) => {
                  setMessage(
                    message.slice(0, cursor) +
                      emoji.native +
                      message.slice(cursor)
                  );
                }}
                theme={themeColorSet.colorPicker}
              />
            }>
            <span className="emoji">
              <FontAwesomeIcon
                className="item mr-3 ml-3"
                size="lg"
                icon={faFaceSmile}
              />
            </span>
          </Popover>
        </div>
        <div
          className="input"
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
              placeholder="Write a message"
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
          className="extension flex justify-center items-center"
          style={{
            width: '12%'
          }}>
          <UploadComponent onUpload={handleUpload}>
            <div className="upload">
              <FontAwesomeIcon
                className="item mr-3"
                size="lg"
                icon={faPaperclip}
              />
            </div>
          </UploadComponent>
          <div className="micro">
            <FontAwesomeIcon
              className="item ml-3"
              size="lg"
              icon={faMicrophone}
            />
          </div>
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default InputChat;
