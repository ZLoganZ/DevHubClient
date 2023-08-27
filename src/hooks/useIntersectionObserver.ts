import { useEffect } from 'react';

const useIntersectionObserver = (targetRef: any, onIntersect: any) => {
  useEffect(() => {
    let intersectTimeoutID: any;
    let intersectTime: any;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectTime = intersectTime || Date.now();
            intersectTimeoutID = setInterval(() => {
              if (Date.now() - intersectTime >= 5000) {
                clearInterval(intersectTimeoutID);
                onIntersect(entry.target);
              }
            }, 100);
          } else {
            clearInterval(intersectTimeoutID);
            intersectTime = null;
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
      clearInterval(intersectTimeoutID);
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, onIntersect]);
};

export default useIntersectionObserver;
