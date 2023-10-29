type option = 'post' | 'avatar' | 'avatar_mini' | 'default' | 'post_mini';

const getImageURL = (src: string, option: option = 'default') => {
  return ImageUrl(src, option);
};

const ImageUrl = (src: string, option: option) => {
  let query = '';
  switch (option) {
    case 'post':
      query = '?tr=w-800,h-600';
      break;
    case 'avatar':
      query = '?tr=w-200,h-200';
      break;
    case 'avatar_mini':
      query = '?tr=w-100,h-100';
      break;
    case 'post_mini':
      query = '?tr=w-400,h-300';
      break;
    default:
      query = '';
      break;
  }
  return `https://ik.imagekit.io/admintck/${src}${query}`;
};

export default getImageURL;
