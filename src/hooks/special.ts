import { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/configStore';
import { useCurrentUserInfo } from './fetch';
import { ConversationType } from '@/types';

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
 * API to detect when a target element intersects with the viewport and triggers a callback function.
 * @param targetRef - A React ref object that references the target element to be observed for
 * intersection.
 * @param onIntersect - The `onIntersect` parameter is a callback function that will be called when the
 * target element intersects with the viewport. It is typically used to trigger some action or update
 * the UI when the element becomes visible to the user.
 * @param options - The `options` parameter is an object that allows you to customize the behavior of
 * the `useIntersectionObserver` hook. It has the following properties:
 * - `threshold` - The `threshold` property is a number between 0 and 1 that represents the percentage
 * of the target element that must be visible to the user before the intersection is detected. The
 * default value is 0.9, which means that 90% of the target element must be visible to the user before
 * the intersection is detected.
 * - `delay` - The `delay` property is a number that represents the number of milliseconds that the
 * target element must be visible to the user before the intersection is detected. The default value
 * is 5000, which means that the target element must be visible to the user for 5 seconds before the
 * intersection is detected.
 * - `pauseOnTabChange` - The `pauseOnTabChange` property is a boolean that determines whether the
 * intersection detection should be paused when the user switches tabs. The default value is true,
 * which means that the intersection detection will be paused when the user switches tabs.
 */
export const useIntersectionObserver = (
  targetRef: React.RefObject<HTMLDivElement>,
  onIntersect: () => void,
  options: {
    threshold?: number;
    delay?: number;
    pauseOnTabChange?: boolean;
  } = {}
) => {
  const { threshold = 0.85, delay = 5000, pauseOnTabChange = true } = options;

  useEffect(() => {
    let intersectTimeoutID: NodeJS.Timeout;
    let intersectTime: number = 0;

    const handleIntersect = debounce(([entry]) => {
      if (entry.isIntersecting && document.hasFocus()) {
        intersectTime = intersectTime || Date.now();

        intersectTimeoutID = setInterval(() => {
          if (Date.now() - intersectTime >= delay) {
            clearInterval(intersectTimeoutID);
            onIntersect();
          }
        }, 100);
      } else {
        clearInterval(intersectTimeoutID);
        intersectTime = 0;
      }
    }, delay);

    const observer = new IntersectionObserver(handleIntersect, {
      threshold
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && pauseOnTabChange) {
        observer.unobserve(targetRef.current!);
      } else {
        observer.observe(targetRef.current!);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intersectTimeoutID);
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, onIntersect, threshold, delay, pauseOnTabChange]);
};

/**
 * The `useOtherUser` function returns the other user in a conversation based on the current user's
 * information and the conversation's members.
 * @param {ConversationType} conversation - The `conversation` parameter is of type `ConversationType`.
 * It represents a conversation object that contains information about the conversation, such as its
 * members.
 * @returns The function `useOtherUser` returns the other user in a conversation, excluding the current
 * user.
 */
export const useOtherUser = (conversation: ConversationType) => {
  const { currentUserInfo } = useCurrentUserInfo();

  return useMemo(() => {
    return conversation.members.filter((member) => member._id !== currentUserInfo._id)[0];
  }, [currentUserInfo, conversation.members]);
};
