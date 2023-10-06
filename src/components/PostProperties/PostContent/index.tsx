import { useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { Image } from 'antd';
import 'react-quill/dist/quill.bubble.css';

import { useIntersectionObserver } from '@/hooks/special';
import { useViewPost } from '@/hooks/mutation';
import { getTheme } from '@/util/theme';
import StyleProvider from './cssPostContent';

interface ContentPostProps {
  postID: string;
  title: string;
  content: string;
  img?: string;
  link?: {
    address: string;
    title: string;
    description: string;
    image: string;
  };
}

const ContentPost = ({ postID, title, content, img, link }: ContentPostProps) => {
  const { themeColorSet } = getTheme();

  const [expanded, setExpanded] = useState(false);

  const { mutateViewPost } = useViewPost();

  const isMoreThan250 = useMemo(() => content.length > 250, [content]);

  const truncatedContent = useMemo(() => {
    if (isMoreThan250 && !expanded) return content.slice(0, 250) + '...';
    return content;
  }, [content, expanded]);

  // ------------------------ View ------------------------
  const contentRef = useRef<HTMLDivElement>(null);

  const onIntersect = () => {
    if (isMoreThan250 && expanded) mutateViewPost(postID);
    else if (!isMoreThan250) mutateViewPost(postID);
  };

  useIntersectionObserver(contentRef, onIntersect);

  return (
    <StyleProvider ref={contentRef} theme={themeColorSet}>
      <div className='title font-bold'>{title}</div>
      <div className='content mt-3'>
        <div className='content__text'>
          <ReactQuill value={truncatedContent} readOnly theme='bubble' />
          {isMoreThan250 && (
            <a onClick={() => setExpanded(!expanded)}>{expanded ? 'Read less' : 'Read more'}</a>
          )}
        </div>
        {img ? (
          <div className='contentImage mt-3'>
            <Image src={img} alt='' style={{ width: '100%' }} />
          </div>
        ) : link ? (
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
                <div>
                  {link.description?.length > 100 ? link.description.slice(0, 100) + '...' : link.description}
                </div>
              </div>
              <img src={link.image} alt='' className='w-1/5' />
            </div>
          </a>
        ) : (
          <></>
        )}
      </div>
    </StyleProvider>
  );
};

export default ContentPost;
