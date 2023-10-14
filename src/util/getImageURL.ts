import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { byRadius, max } from '@cloudinary/url-gen/actions/roundCorners';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

type option = 'post' | 'avatar' | 'avatar_mini' | 'default' | 'post_mini';

const getImageURL = (src: string, option: option = 'default') => {
  if (src.includes('http')) return src;

  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
  });

  const resizeOptions = {
    post: fill().width(800),
    post_mini: fill().width(400),
    avatar: fill().width(400).height(400).gravity(focusOn(FocusOn.face())),
    avatar_mini: fill().height(200).width(200).gravity(focusOn(FocusOn.face())),
    default: fill()
  };

  const roundCorners = {
    post: byRadius(0),
    post_mini: byRadius(0),
    avatar: max(),
    avatar_mini: max(),
    default: byRadius(0)
  };

  const myImage = cld
    .image(src)
    .resize(resizeOptions[option || 'default'])
    .roundCorners(roundCorners[option || 'default']);

  myImage.format('auto');

  return myImage.toURL();
};

export default getImageURL;
