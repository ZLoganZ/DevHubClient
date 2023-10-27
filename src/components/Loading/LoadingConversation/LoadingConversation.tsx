import { Skeleton, Space } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';

const LoadingConversation = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  return (
    // <div className='px-4'>
    //   <Skeleton className='mt-8' active />
    //   <Skeleton className='mt-8' active />
    //   <Skeleton className='mt-8' active />
    //   <Skeleton className='mt-8' active />
    //   <div
    //     className='shared'
    //     style={{
    //       width: '23%',
    //       height: '100vh',
    //       marginLeft: '77%',
    //       position: 'fixed',
    //       backgroundColor: themeColorSet.colorBg1
    //     }}>
    //     <div
    //       className='extension px-3 flex items-center'
    //       style={{
    //         height: '12%',
    //         borderBottom: '1px solid',
    //         borderColor: themeColorSet.colorBg4
    //       }}>
    //       <div className='flex justify-center items-center w-full'>
    //         <div
    //           className='setting text-center'
    //           style={{
    //             width: '25%'
    //           }}>
    //           <Skeleton.Button active size='large' shape='circle' />
    //         </div>
    //         <div
    //           className='notification text-center'
    //           style={{
    //             width: '25%'
    //           }}>
    //           <Skeleton.Button active size='large' shape='circle' />
    //         </div>
    //         <div
    //           className='warning text-center'
    //           style={{
    //             width: '25%'
    //           }}>
    //           <Skeleton.Button active size='large' shape='circle' />
    //         </div>
    //         <div
    //           className='logout text-center'
    //           style={{
    //             width: '25%'
    //           }}>
    //           <Skeleton.Button active size='large' shape='circle' />
    //         </div>
    //       </div>
    //     </div>
    //     <div className='fileShare px-3 py-4'>
    //       <div className='sharedMedia'>
    //         <Space className='content' size={20}>
    //           <Skeleton.Image active />
    //           <Skeleton.Image active />
    //           <Skeleton.Image active />
    //         </Space>
    //       </div>
    //       <div className='sharedFile mt-5'>
    //         <div className='flex justify-between items-center mb-3'></div>
    //         <div className='content'>
    //           <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
    //           <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
    //           <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
    //           <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
    //           <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
    //           <Skeleton className='mb-3' active avatar paragraph={{ rows: 1 }} />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      <div
        className='flex justify-between items-center py-6 px-6'
        style={{
          height: '13%',
          borderBottom: '1px solid',
          borderColor: themeColorSet.colorBg4
        }}>
        <div className='flex gap-3 items-center'>
          <Skeleton.Avatar active size='large' />
        </div>
        <div className='displayShare'>
          <Skeleton.Button active size='large' shape='circle' />
        </div>
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
      <Skeleton.Input active size='large' block />
    </>
  );
};

export default LoadingConversation;
