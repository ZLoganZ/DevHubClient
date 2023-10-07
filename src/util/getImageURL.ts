import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

type option = 'post' | 'avatar' | 'mini';

const getImageURL = (src: string, option: option = 'post') => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
  });

  const resizeOptions = {
    post: fill(),
    avatar: fill().width(200).height(200).gravity(focusOn(FocusOn.face())),
    mini: fill().height(50).height(50).gravity(focusOn(FocusOn.face())),
    default: fill().height(400).gravity(focusOn(FocusOn.face()))
  };

  const myImage = cld.image(src).resize(resizeOptions[option || 'default']);

  return myImage.toURL();
};

export default getImageURL;
