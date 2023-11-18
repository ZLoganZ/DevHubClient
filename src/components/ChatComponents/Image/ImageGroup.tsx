import { Image } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import getImageURL from '@/util/getImageURL';

interface IImageGroup {
  preview?: boolean;
  images?: string[];
}

const ImageGroup: React.FC<IImageGroup> = ({ images, preview = false }) => {
  const listImage: string[][] = [];

  images?.map((image, index) => {
    if (index % 3 === 0) {
      listImage.push([]);
    }
    listImage[listImage.length - 1].push(image);
  });
  return (
    <div className='flex flex-col gap-1'>
      {listImage.map((row, index) => (
        <div key={index} className='flex gap-1'>
          {row.map((image, index) => (
            <Image
              key={index}
              src={getImageURL(image)}
              alt='Avatar'
              preview={preview ? { src: getImageURL(image), mask: <FontAwesomeIcon icon={faEye} /> } : false}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageGroup;
