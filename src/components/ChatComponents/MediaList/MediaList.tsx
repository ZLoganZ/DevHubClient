import { Button, Col, Empty, Image, Row, Space, Tabs } from 'antd';
import { faArrowLeftLong, faDownload, faLink as faReLink } from '@fortawesome/free-solid-svg-icons';
import {
  faEye,
  faFileAudio as faReFileAudio,
  faFolderOpen as faReFolderOpen,
  faImages as faReImages
} from '@fortawesome/free-regular-svg-icons';

import StyleProvider from './cssMediaList';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { IMessage } from '@/types';
import getImageURL from '@/util/getImageURL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDateTimeToNow } from '@/util/formatDateTime';

interface IMediaList {
  items: {
    images: IMessage[];
    files: IMessage[];
    links: IMessage[];
    audios: IMessage[];
  };
  type: string;
  enable: React.Dispatch<React.SetStateAction<boolean>>;
}

const MediaList: React.FC<IMediaList> = ({ items, type, enable }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const downloadImage = async (url?: string) => {
    if (!url) return;
    const originalImage = url;
    const image = await fetch(getImageURL(originalImage)!);

    //Split image name
    const nameSplit = originalImage.split('/');
    const duplicateName = nameSplit.pop();
    const name = duplicateName?.substring(0, duplicateName.lastIndexOf('_'));

    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = '' + name + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <StyleProvider className='h-full' theme={themeColorSet}>
      <Row align={'middle'} className='pt-2'>
        <Button
          className='back-button w-8 h-8 flex justify-center items-center mr-2 rounded-full bg-none hover:bg-gray-200 border-none shadow-none'
          onClick={() => {
            enable(false);
          }}>
          <FontAwesomeIcon className='text-lg' icon={faArrowLeftLong} />
        </Button>
        <span className='font-bold text-lg'>Medias</span>
      </Row>
      <Tabs
        defaultActiveKey={type}
        centered
        tabBarStyle={{
          height: '40px',
          borderBottom: '1px solid ' + themeColorSet.colorBg3
        }}
        items={[
          {
            key: 'image',
            label: 'Images',
            children:
              items.images.length === 0 ? (
                <Empty
                  image={<FontAwesomeIcon icon={faReImages} />}
                  description={
                    <p className='text-sm' style={{ color: themeColorSet.colorText3 }}>
                      No images
                    </p>
                  }
                />
              ) : (
                <Col className='px-2'>
                  <div
                    className='list-items'
                    style={{
                      overflowY: 'auto',
                      height: 'calc(100vh - 120px )'
                    }}>
                    {items.images.map((item) =>
                      item.images!.map((image, index) => (
                        <div
                          className='fileContent flex justify-between items-center mb-2 ml-2'
                          key={item._id + index}>
                          <div className='left flex justify-between items-center'>
                            <div className='image mr-2 flex rounded-xl h-14 w-14 overflow-hidden'>
                              <Image
                                src={getImageURL(image, 'post')}
                                alt='image'
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                preview={{ src: getImageURL(image), mask: <FontAwesomeIcon icon={faEye} /> }}
                              />
                            </div>
                            <Space className='info' direction='vertical'>
                              <div
                                className='name'
                                style={{
                                  color: themeColorSet.colorText1,
                                  fontWeight: '600'
                                }}>
                                {item.sender.name}
                              </div>
                              <Space
                                style={{
                                  color: themeColorSet.colorText3
                                }}>
                                <div className='date'>{getDateTimeToNow(item.createdAt)}</div>
                              </Space>
                            </Space>
                          </div>
                          <div
                            className='right cursor-pointer'
                            onClick={() => {
                              void downloadImage(image);
                            }}>
                            <FontAwesomeIcon icon={faDownload} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Col>
              )
          },
          {
            key: 'file',
            label: 'Files',
            children:
              items.files.length === 0 ? (
                <Empty
                  image={<FontAwesomeIcon icon={faReFolderOpen} />}
                  description={
                    <p className='text-sm' style={{ color: themeColorSet.colorText3 }}>
                      No files
                    </p>
                  }
                />
              ) : (
                <Col className='pl-2'>
                  <div
                    className='list-items'
                    style={{
                      overflowY: 'auto',
                      height: 'calc(100vh - 120px )'
                    }}>
                    hi
                  </div>
                </Col>
              )
          },
          {
            key: 'link',
            label: 'Links',
            children:
              items.links.length === 0 ? (
                <Empty
                  image={<FontAwesomeIcon icon={faReLink} />}
                  description={
                    <p className='text-sm' style={{ color: themeColorSet.colorText3 }}>
                      No links
                    </p>
                  }
                />
              ) : (
                <Col className='pl-2'>
                  <div
                    className='list-items'
                    style={{
                      overflowY: 'auto',
                      height: 'calc(100vh - 120px )'
                    }}>
                    hi
                  </div>
                </Col>
              )
          },
          {
            key: 'audio',
            label: 'Audios',
            children:
              items.audios.length === 0 ? (
                <Empty
                  image={<FontAwesomeIcon icon={faReFileAudio} />}
                  description={
                    <p className='text-sm' style={{ color: themeColorSet.colorText3 }}>
                      No audios
                    </p>
                  }
                />
              ) : (
                <Col className='pl-2'>
                  <div
                    className='list-items'
                    style={{
                      overflowY: 'auto',
                      height: 'calc(100vh - 120px )'
                    }}>
                    hi
                  </div>
                </Col>
              )
          }
        ]}
      />
    </StyleProvider>
  );
};

export default MediaList;
