declare global {
  interface Window {
    cloudinary: any;
  }
}

import { useEffect } from 'react';

let cloudinary: any;
let widget: any;

interface UploadComponentProps {
  onUpload: any;
  children: React.ReactNode;
}

const UploadComponent = (Props: UploadComponentProps) => {
  useEffect(() => {
    if (!cloudinary) {
      cloudinary = window.cloudinary;
    }

    const onIdle = () => {
      if (!widget) {
        widget = createWidget();
      }
    };

    'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);
  }, []);

  const createWidget = () => {
    const options = {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      sources: ['local'],
      showAdvancedOptions: false,
      cropping: true,
      multiple: false,
      defaultSource: 'local',
      styles: {
        palette: {
          window: '#000000',
          sourceBg: '#000000',
          windowBorder: '#8E9FBF',
          tabIcon: '#FFFFFF',
          inactiveTabIcon: '#8E9FBF',
          menuIcons: '#2AD9FF',
          link: '#08C0FF',
          action: '#336BFF',
          inProgress: '#00BFFF',
          complete: '#33ff00',
          error: '#EA2727',
          textDark: '#000000',
          textLight: '#FFFFFF'
        },
        fonts: {
          default: null,
          "'Space Mono', monospace": {
            url: 'https://fonts.googleapis.com/css?family=Space+Mono',
            active: true
          }
        }
      }
    };

    return cloudinary?.createUploadWidget(options, (error: any, result: any) => {
      if (error || result.event === 'success') {
        Props.onUpload(error, result, widget);
      }
    });
  };

  const open = () => {
    if (!widget) {
      widget = createWidget();
    }
    widget.open();
  };

  return <div onClick={open}>{Props.children}</div>;
};

export default UploadComponent;
