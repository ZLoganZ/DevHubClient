import { useEffect, useRef, useState } from 'react';
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

const ContentPost = (Props: ContentPostProps) => {
  const { themeColorSet } = getTheme();

  const [expanded, setExpanded] = useState(false);

  const { mutateViewPost } = useViewPost();

  const isMoreThan250 = Props.content.length > 250;

  const [displayContent, setDisplayContent] = useState(Props.content);

  useEffect(() => {
    setDisplayContent(isMoreThan250 && !expanded ? Props.content.slice(0, 250) : Props.content);
  }, [expanded, Props.content]);

  // ------------------------ View ------------------------
  const contentRef = useRef<HTMLDivElement>(null);

  const onIntersect = () => {
    if (isMoreThan250 && expanded) mutateViewPost(Props.postID);
    else if (!isMoreThan250) mutateViewPost(Props.postID);
  };

  useIntersectionObserver(contentRef, onIntersect);

  return (
    <StyleProvider ref={contentRef} theme={themeColorSet}>
      <div className='title font-bold'>{Props.title}</div>
      <div className='content mt-3'>
        <div className='content__text'>
          <ReactQuill value={displayContent} readOnly theme='bubble' />
          {isMoreThan250 && (
            <a onClick={() => setExpanded(!expanded)}>{expanded ? 'Read less' : 'Read more'}</a>
          )}
        </div>
        {Props.img ? (
          <div className='contentImage mt-3'>
            <Image src={Props.img} alt='' style={{ width: '100%' }} />
          </div>
        ) : Props.link ? (
          <a
            href={Props.link.address}
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
                  {Props.link.title?.length > 100 ? Props.link.title.slice(0, 100) + '...' : Props.link.title}
                </div>
                <div>
                  {Props.link.description?.length > 100
                    ? Props.link.description.slice(0, 100) + '...'
                    : Props.link.description}
                </div>
              </div>
              <img src={Props.link.image} alt='' className='w-1/5' />
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
