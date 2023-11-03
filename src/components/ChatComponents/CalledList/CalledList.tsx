import { Col, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import StyleProvider from './cssCalledList';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { ConversationType } from '@/types';
import CalledBox from '@/components/ChatComponents/CalledBox';

interface IContactsList {
  conversations: ConversationType[];
  selected?: string;
}

const CalledList: React.FC<IContactsList> = ({ conversations, selected = true }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <Row className='contacts'>
        <Col span={24}>
          <Row>
            <Space
              className='myInfo flex justify-between items-center py-4 px-3 w-full'
              style={{
                borderColor: themeColorSet.colorBg4
              }}>
              <div
                className='text-2xl'
                style={{
                  color: themeColorSet.colorText1
                }}>
                Call
              </div>
              <div className='iconPlus cursor-pointer' onClick={() => {}}>
                <FontAwesomeIcon
                  className='text-lg rounded-lg'
                  icon={faPlusCircle}
                  color={themeColorSet.colorText1}
                />
              </div>
            </Space>
          </Row>
          <Row>
            <div className='userActive px-3 w-full'>
              <div
                className='listUser flex flex-col'
                style={{
                  overflow: 'auto'
                }}>
                {conversations.map((conversation) => (
                  <CalledBox
                    key={conversation._id}
                    conversation={conversation}
                    selected={conversation._id === selected}
                  />
                ))}
                
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </StyleProvider>
  );
};

export default CalledList;
