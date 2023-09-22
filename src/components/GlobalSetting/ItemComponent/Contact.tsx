import { icon } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faTwitter, faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const contactArrays = [
  {
    key: '0',
    label: 'Facebook',
    linkDefault: 'https://www.facebook.com/',
    icon: <FontAwesomeIcon icon={icon(faFacebookF)} />,
  },
  {
    key: '1',
    label: 'Github',
    linkDefault: 'https://github.com/',
    icon: <FontAwesomeIcon icon={icon(faGithub)} />,
  },
  {
    key: '2',
    label: 'Twitter',
    linkDefault: 'https://twitter.com/',
    icon: <FontAwesomeIcon icon={icon(faTwitter)} />,
  },
  {
    key: '3',
    label: 'Instagram',
    linkDefault: 'https://www.instagram.com/',
    icon: <FontAwesomeIcon icon={icon(faInstagram)} />,
  },
  {
    key: '4',
    label: 'Linkedin',
    linkDefault: 'https://www.linkedin.com/',
    icon: <FontAwesomeIcon icon={icon(faLinkedin)} />,
  },
];
export default contactArrays;
