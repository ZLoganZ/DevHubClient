import { useAppSelector } from '@/hooks/special';
import { IConversation, IUserInfo } from '@/types';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';

interface IInfoCalled {
  user: IUserInfo;
  conversation: IConversation;
  stateCalled: string;
  notification: JSX.Element;
}

const InfoCalled: React.FC<IInfoCalled> = ({ user, conversation, stateCalled, notification }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  console.log('user ', user);
  console.log('conversation ', conversation);
  console.log('stateCalled ', stateCalled);
  console.log('notification ', notification);
  return (
    <>
      <Row>
        <Col span={24}>
          <Row className='header'>
            <Col span={24} className='flex justify-between items-center'>
              <div className='flex items-center'>
                <div className='avatar'>
                  <img src={user.user_image} alt='avatar' />
                </div>
                <div className='flex flex-col ml-2'>
                  <div className='text-base font-semibold'>{user.name}</div>
                  <div className='text-xs text-gray-500'>Đang gọi...</div>
                </div>
              </div>
              <div className='flex items-center'>
                <div className='display-share'>
                  <FontAwesomeIcon icon={faCalendar} color='#fff' />
                </div>
                <div className='audio-call'>
                  <FontAwesomeIcon icon={faCalendar} color='#fff' />
                </div>
                <div className='video-call'>
                  <FontAwesomeIcon icon={faCalendar} color='#fff' />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default InfoCalled;
