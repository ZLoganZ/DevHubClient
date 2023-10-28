import { Col, ConfigProvider, Row, Skeleton, Space } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import LoadingConversation from '../LoadingConversation';

const LoadingChat = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  return (
    <div className='chat overflow-hidden'>
      <Row className='h-screen slider'>
        <Col span={1} className='py-3 flex flex-col justify-between items-center'>
          <div>
            <div className='logo items-center'>
              <Skeleton.Button active size='large' shape='circle' />
            </div>
            <div className='option py-8 flex flex-col items-center'>
              <Space size={35} direction='vertical' align='center'>
                <div className='optionItem relative'>
                  <Skeleton.Button active size='large' shape='circle' />
                </div>
                <div className='optionItem relative'>
                  <Skeleton.Button active size='large' shape='circle' />
                </div>
                <div className='optionItem relative'>
                  <Skeleton.Button active size='large' shape='circle' />
                </div>
                <div className='optionItem relative'>
                  <Skeleton.Button active size='large' shape='circle' />
                </div>
              </Space>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <div className='mode optionItem py-6'>
              <Skeleton.Button active size='large' shape='circle' />
            </div>
            <div className='mode'>
              <Skeleton.Button active size='large' shape='circle' />
            </div>
          </div>
        </Col>
        <Col span={5}>
          <Row className='searchChat'>
            <Col span={24}>
              <Row>
                <Space
                  className='myInfo flex justify-between items-start py-4 px-3 w-full'
                  style={{
                    borderColor: themeColorSet.colorBg4
                  }}>
                  <div className='flex justify-between items-center'>
                    <div className='avatar mr-3'>
                      <Skeleton.Avatar active size='large' />
                    </div>
                  </div>
                  <div className='iconPlus cursor-pointer'>
                    <Skeleton.Button active size='large' shape='circle' />
                  </div>
                </Space>
              </Row>
              <Row>
                <div
                  className='searchInput pl-3 py-4 w-full flex justify-between items-center'
                  style={{
                    borderColor: themeColorSet.colorBg4
                  }}>
                  <div className='input flex items-center w-full'>
                    <div
                      className='iconSearch mr-2'
                      style={{
                        color: themeColorSet.colorText3
                      }}>
                      <Skeleton.Button active size='large' shape='circle' />
                    </div>
                    <ConfigProvider
                      theme={{
                        token: {
                          lineWidth: 0,
                          controlHeight: 40
                        }
                      }}>
                      <Skeleton.Input active size='large' block />
                    </ConfigProvider>
                  </div>
                </div>
              </Row>
              <Row>
                <div
                  className='userChat w-full'
                  style={{
                    overflow: 'auto'
                  }}>
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
                  <Skeleton active avatar paragraph={{ rows: 0 }} />
                </div>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={18} style={{ height: '92%' }}>
          <LoadingConversation />
        </Col>
      </Row>
    </div>
  );
};

export default LoadingChat;
