import { Col, Row, Skeleton, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

import StyleProvider from './cssCalledList';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import CalledBox from '@/components/ChatComponents/CalledBox';
import { useGetCalled } from '@/hooks/fetch';
import { CalledType } from '@/types';

const CalledList = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);

  const { themeColorSet } = getTheme();

  const { calledList, isLoadingGetCalled } = useGetCalled();
  const [calledLists, setCalledLists] = useState<CalledType[] | undefined>(calledList);
  useEffect(() => {
    setCalledLists(calledList);
  }, [calledList]);

  const listConRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (listConRef.current) {
      setHeight(listConRef.current.clientHeight);
    }
  }, [calledLists]);

  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
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
        <Row className='called h-full'>
          <Col span={24} className='h-full'>
            <Row>
              <Space
                className='flex justify-between items-center py-5 px-3 w-full'
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
            <Row className='h-[89%] ml-3'>
              {/* <div className='list-called   overflow-y-auto'> */}
              <Scrollbar
                className=''
                trackYProps={{
                  style: {
                    right: '-12px'
                  }
                }}
                scrollerProps={{
                  style: {
                    right: '-12px'
                  }
                }}>
                <div className='listConversation flex flex-col overflow-y-hidden' ref={listConRef}>
                  {calledLists?.map((called) => (
                    <CalledBox key={called._id} called={called} />
                  ))}
                </div>
                {/* <div className='called absolute w-3 h-[92%] top-0 -right-3 overflow-y-auto'>
                  <div className='w-3' style={{ height: `${height}px` }}></div>
                </div> */}
              </Scrollbar>
              {/* </div> */}
            </Row>
          </Col>
        </Row>
      )}
    </StyleProvider>
  );
};

export default CalledList;
