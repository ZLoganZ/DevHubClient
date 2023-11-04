import { Col, Row, Skeleton, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import StyleProvider from './cssCalledList';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import CalledBox from '@/components/ChatComponents/CalledBox';
import { useGetCalled } from '@/hooks/fetch';
import { CalledType } from '@/types';
import { useEffect, useState } from 'react';

const CalledList = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);

  const { themeColorSet } = getTheme();

  const { calledList, isLoadingGetCalled } = useGetCalled();
  const [calledLists, setCalledLists] = useState<CalledType[]>(calledList);
  useEffect(() => {
    setCalledLists(calledList);
  }, [calledList]);

  return (
    <StyleProvider theme={themeColorSet}>
      {isLoadingGetCalled ? (
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
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      ) : (
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
                  {calledLists?.map((called) => (
                    <CalledBox key={called._id} called={called} />
                  ))}
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      )}
    </StyleProvider>
  );
};

export default CalledList;
