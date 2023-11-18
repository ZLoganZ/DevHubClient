import { Image } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';

interface IImageGroup {
  preview?: boolean;
  images?: string[];
}

const ImageGroup: React.FC<IImageGroup> = ({ images, preview = false }) => {

  return (
    <div className='flex gap-1'>
      {images?.map((image, index) => (
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
  );
};

export default ImageGroup;
