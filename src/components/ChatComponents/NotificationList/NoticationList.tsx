import { Col, ConfigProvider, Empty, Input, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

import { getTheme } from '@/util/theme';
import { NEW_CONVERSATION } from '@/util/constants/SettingSystem';
import { messageService } from '@/services/MessageService';
import Avatar from '@/components/ChatComponents/Avatar/AvatarMessage';
import { useAppSelector } from '@/hooks/special';
import { useReceiveConversation } from '@/hooks/mutation';
import { UserInfoType } from '@/types';
import StyleProvider from './cssNotificationList';

interface IContactsList {
  notifications: any;
}

const ConversationList: React.FC<IContactsList> = ({ notifications }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { theme } = useAppSelector((state) => state.theme);
  const { chatSocket } = useAppSelector((state) => state.socketIO);
  const { themeColorSet } = getTheme();

  return <StyleProvider theme={themeColorSet}></StyleProvider>;
};

export default ConversationList;
