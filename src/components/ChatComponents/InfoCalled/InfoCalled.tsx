import { useAppSelector } from '@/hooks/special';
import { ICalled, IConversation } from '@/types';
import { capitalizeFirstLetter } from '@/util/convertText';
import { getDateTime } from '@/util/formatDateTime';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';

interface IInfoCalled {
  called: ICalled;
  conversation: IConversation;
  stateCalled: string;
  notification: JSX.Element;
}

const InfoCalled: React.FC<IInfoCalled> = ({ called, conversation, stateCalled, notification }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  console.log('conversation ', conversation);
  console.log('stateCalled ', stateCalled);
  console.log('notification ', notification);
  return (
    <Row>
      <Col span={24}>
        <Row className='info-called'>
          <Col span={24}>
            <Row className='info-called__header'>
              <Col span={24}>
                <Row className='info-called__header__title '>
                  <Col span={24}>
                    <Row className='info-called__header__title__name'>
                      <Col span={4}>
                        <span>Called by </span>
                      </Col>
                      <Col span={12}>
                        <span>: {called.sender.name}</span>
                      </Col>
                    </Row>
                    {conversation.type === 'group' && (
                      <Row>
                        <Col span={4}>
                          <span>Call in group </span>
                        </Col>
                        <Col span={12}>: {conversation.name}</Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='info-called__body pt-2'>
              <Col span={24}>
                <Row className='info-called__body__time'>
                  <Col span={1} className='flex justify-center'>
                    <FontAwesomeIcon className='text-lg' icon={faCalendar} />
                  </Col>
                  <Col span={12} offset={3}>
                    <span className='info-called__header__time__date'>{getDateTime(called.createdAt)}</span>
                  </Col>
                </Row>
                <Row className='info-called__body__notification'>
                  <Col span={1} className='flex justify-center'>
                    {notification}
                  </Col>
                  <Col span={12} offset={3}>
                    <span className='info-called__header__title__state'>
                      {capitalizeFirstLetter(stateCalled)}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default InfoCalled;
