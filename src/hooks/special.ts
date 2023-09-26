import { useEffect, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/configStore';
import { useUserInfo } from './fetch';

/**
 * The useAppDispatch function returns the useDispatch function with the AppDispatch type.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook `useAppSelector` is used to select and access the state from the Redux store in a React component.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * The `useIntersectionObserver` function is a custom React hook that uses the Intersection Observer
 * API to detect when a target element intersects with the viewport and triggers a callback function
 * after a specified time.
 * @param targetRef - The targetRef is a mutable ref object that represents the element that you want
 * to observe for intersection. It is typically created using the useRef() hook and passed as a
 * parameter to the useIntersectionObserver hook.
 * @param onIntersect - The `onIntersect` parameter is a callback function that will be called when the
 * target element intersects with the viewport. It is a function that you can define and provide to the
 * `useIntersectionObserver` hook.
 * @param {number} [time=5000] - The `time` parameter is an optional parameter that specifies the
 * duration in milliseconds for which the target element needs to be continuously intersecting with the
 * viewport before triggering the `onIntersect` callback. If the target element is continuously
 * intersecting for the specified duration, the `onIntersect` callback will
 * be triggered. Otherwise, the `onIntersect` callback will not be triggered.
 */
export const useIntersectionObserver = (
  targetRef: React.MutableRefObject<null>,
  onIntersect: () => void,
  time: number = 5000
) => {
  useEffect(() => {
    let intersectTimeoutID: NodeJS.Timeout;
    let intersectTime: number = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          intersectTime = intersectTime || Date.now();
          intersectTimeoutID = setInterval(() => {
            if (Date.now() - intersectTime >= time) {
              clearInterval(intersectTimeoutID);
              onIntersect();
            }
          }, 100);
        } else {
          clearInterval(intersectTimeoutID);
          intersectTime = 0;
        }
      },
      {
        rootMargin: '0px',
        threshold: 1.0
      }
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
  }, [targetRef, onIntersect, time]);
};

/**
 * The `useIntersectionObserverNow` function is a custom React hook that uses the Intersection Observer
 * API to detect when a target element intersects with the viewport and calls a callback function when
 * it does.
 * @param targetRef - The targetRef is a React ref object that references the HTMLDivElement that you
 * want to observe for intersection. It allows you to access and manipulate the DOM element in your
 * component.
 * @param onIntersect - The `onIntersect` parameter is a callback function that will be called when the
 * target element intersects with the viewport. It can be used to perform some action or trigger some
 * behavior when the intersection occurs.
 */
export const useIntersectionObserverNow = (
  targetRef: React.RefObject<HTMLDivElement>,
  onIntersect: () => void
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin: '0px',
        threshold: 1.0
      }
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

/**
 * The `useOtherUser` function returns the information of the other user in a conversation, including
 * their name.
 * @param {any} conversation - The `conversation` parameter is an object that represents a
 * conversation. It likely contains information about the users involved in the conversation, such as
 * their IDs and usernames.
 * @returns The function `useOtherUser` returns the information of the other user in a conversation.
 */
export const useOtherUser = (conversation: any) => {
  const { userInfo } = useUserInfo();

  const otherUser = useMemo(() => {
    const currentUser = userInfo._id;

    const otherUser = conversation?.users?.filter(
      (user: any) => user._id !== currentUser
    );

    return otherUser[0];
  }, [userInfo, conversation.users]);

  return otherUser;
};
