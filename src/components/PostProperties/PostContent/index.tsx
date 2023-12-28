import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { Image } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import 'react-quill/dist/quill.bubble.css';

import { useViewPost } from '@/hooks/mutation';
import { getTheme } from '@/util/theme';
import getImageURL from '@/util/getImageURL';
import { imageErrorFallback } from '@/util/constants/SettingSystem';
import { TypeOfLink } from '@/types';
import StyleProvider from './cssPostContent';
import { useIntersectionObserver } from '@/hooks/special';

interface IContentPostProps {
  postID: string;
  title: string;
  content: string;
  image?: string[];
  link?: TypeOfLink;
}

const ContentPost: React.FC<IContentPostProps> = ({ postID, title, content, image, link }) => {
  const { themeColorSet } = getTheme();

  const [expanded, setExpanded] = useState(false);

  const { mutateViewPost } = useViewPost();

  const isMoreThan500 = useMemo(() => content.length > 500 && content.length > 515, [content]);

  const [contentQuill, setContent] = useState(content);

  useLayoutEffect(() => {
    if (isMoreThan500 && !expanded) setContent(content.slice(0, 500) + '...');
    else setContent(content);
  }, [expanded, content, isMoreThan500]);

  // ------------------------ View ------------------------
  const contentRef = useRef<HTMLDivElement>(null);

  const onIntersect = useCallback(() => {
    if (isMoreThan500 && expanded) mutateViewPost(postID);
    else if (!isMoreThan500) mutateViewPost(postID);
  }, [postID, isMoreThan500, expanded]);

  useIntersectionObserver(contentRef, onIntersect, { delay: 5000 });

  return (
    <StyleProvider ref={contentRef} theme={themeColorSet}>
      <div className='title font-bold'>{title}</div>
      <div className='content mt-3'>
        <div className='content__text'>
          <ReactQuill value={contentQuill} readOnly theme='bubble' />
          {isMoreThan500 && (
            <a className='clickMore' onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Read less' : 'Read more'}
            </a>
          )}
        </div>
        {image && image?.length !== 0 ? (
          <div className='contentImage overflow-hidden h-full w-full object-cover my-3 flex items-center justify-center'>
            <Image
              src={getImageURL(image[0], 'post')}
              alt='pic content'
              fallback={imageErrorFallback}
              preview={{ src: getImageURL(image[0]), mask: <FontAwesomeIcon icon={faEye} /> }}
            />
          </div>
        ) : (
          link && (
            <a
              href={link.address}
              target='_blank'
              style={{
                color: themeColorSet.colorText2
              }}>
              <div
                className='contentLink flex mt-5 px-3 py-3 cursor-pointer'
                style={{ backgroundColor: themeColorSet.colorBg4 }}>
                <div className='left w-4/5 p-2'>
                  <div
                    className='mb-2'
                    style={{
                      fontWeight: 600,
                      color: themeColorSet.colorText1
                    }}>
                    {link.title?.length > 100 ? link.title.slice(0, 100) + '...' : link.title}
                  </div>
                  <>
                    {link.description?.length > 100
                      ? link.description.slice(0, 100) + '...'
                      : link.description}
                  </>
                </div>
                <img src={link.image} alt='pic link' className='w-1/5' />
              </div>
            </a>
          )
        )}
      </div>
    </StyleProvider>
  );
};

export default ContentPost;
