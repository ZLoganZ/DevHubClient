import { Skeleton, Space } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';

const LoadingConversation = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  return (
    <>
      <div
        className='flex justify-between items-center py-6 px-6'
        style={{
          height: '13%',
          borderBottom: '1px solid',
          borderColor: themeColorSet.colorBg4
        }}>
        <div className='flex flex-row items-center w-96'>
          <Skeleton.Avatar active size='large' />
          <Skeleton className='pl-2' active paragraph={{ rows: 1 }} />
        </div>
        <Space align='center' size={20} className='flex gap-3'>
          <div className='call p-1'>
            <Skeleton.Button active size='small' shape='circle' />
          </div>
          <div className='call p-1'>
            <Skeleton.Button active size='small' shape='circle' />
          </div>
          <div className='displayShare ml-4 p-1'>
            <Skeleton.Button active size='small' shape='circle' />
          </div>
        </Space>
      </div>
      <div
        className='body px-3'
        style={{
          height: '88%',
          overflow: 'auto'
        }}>
        <div className='flex-1 overflow-y-hidden'>
          <div className='pt-1' />
          <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
          <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
          <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
          <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
          <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
          <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
          <div className='pb-1' />
        </div>
      </div>
      <div className='flex justify-between items-center px-5'>
        <div className='mr-2'>
          <Skeleton.Button active size='small' shape='circle' />
        </div>
        <Skeleton.Input active size='large' block />
        <Space
          className='extension flex justify-center items-center'
          style={{
            width: '12%'
          }}>
          <div className='upload'>
            <Skeleton.Button active size='small' shape='circle' />
          </div>
          <div className='micro'>
            <Skeleton.Button active size='small' shape='circle' />
          </div>
        </Space>
      </div>
    </>
  );
};

export default LoadingConversation;
