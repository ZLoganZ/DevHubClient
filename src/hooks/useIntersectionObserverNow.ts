import { useEffect } from 'react';

const useIntersectionObserverNow = (targetRef: any, onIntersect: any) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 1.0,
      },
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, onIntersect]);
};

export default useIntersectionObserverNow;
