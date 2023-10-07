import { AdvancedImage, placeholder, lazyload } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail, fill } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

interface PicGenieProps {
  src: string;
  style?: React.CSSProperties;
  option?: 'post' | 'avatar' | 'mini';
}

const PicGenie = ({ src, option, style }: PicGenieProps) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
  });

  const resizeOptions = {
    post: fill(),
    avatar: thumbnail().width(200).height(200).gravity(focusOn(FocusOn.face())),
    mini: thumbnail().width(50).height(50).gravity(focusOn(FocusOn.face())),
    default: thumbnail().width(300).height(300).gravity(focusOn(FocusOn.face()))
  };

  const myImage = cld.image(src).resize(resizeOptions[option || 'default']);

  return (
    <div style={style}>
      <AdvancedImage
        plugins={[lazyload(), placeholder({ mode: 'blur' })]}
        cldImg={myImage}
      />
    </div>
  );
};

export default PicGenie;
