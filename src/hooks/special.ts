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

interface ObserverOptions {
  threshold?: number;
  delay?: number;
  pauseOnTabChange?: boolean;
}
/**
 * The `useIntersectionObserver` function is a custom React hook that uses the Intersection Observer
 * API to determine if a target element is in the viewport and returns a ref to the target element and
 * a boolean indicating if it is in view.
 * @param [options] - An optional object that contains the following properties:
 * @param [options.threshold] - The `threshold` property is of type `number` and represents the
 * percentage of the target element that must be visible to trigger the callback function.
 * @param [options.delay] - The `delay` property is of type `number` and represents the number of
 * milliseconds to wait before triggering the callback function.
 * @param [options.pauseOnTabChange] - The `pauseOnTabChange` property is of type `boolean` and
 * indicates whether or not to pause the Intersection Observer when the user changes tabs.
 * @returns The function `useIntersectionObserver` returns an array with two elements: a
 * `React.RefObject<HTMLDivElement>` and a boolean value.
 *
 * @example
 * const [targetRef, inView] = useIntersectionObserver({ threshold: 0.85, delay: 5000, pauseOnTabChange: true });
 *
 * <div ref={targetRef}>
 *  {inView && <p>Target element is in view!</p>}
 * </div>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API Intersection Observer API}
 */
export const useIntersectionObserver = (
  targetRef: React.RefObject<Element>,
  onIntersect: () => void,
  options?: ObserverOptions
) => {
  const { threshold = 0.85, delay = 0, pauseOnTabChange = true } = options || {};

  useEffect(() => {
    const handleIntersect = debounce((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && document.hasFocus()) {
          onIntersect();
        }
      });
    }, delay);

    const observer = new IntersectionObserver(handleIntersect, { threshold });

    const handleVisibilityChange = () => {
      if (!targetRef.current) return;
      if (document.visibilityState === 'hidden' && pauseOnTabChange) {
        observer.unobserve(targetRef.current);
      } else {
        observer.observe(targetRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, onIntersect]);
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
