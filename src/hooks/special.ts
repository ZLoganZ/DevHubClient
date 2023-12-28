import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/configStore';
import { useCurrentUserInfo } from './fetch';
import { IConversation } from '@/types';

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
 * The `useIntersectionObserver` function is a custom React hook that allows you to observe when an
 * element intersects with the viewport using the Intersection Observer API.
 * @param targetRef - A React ref object that references the element that you want to observe for
 * intersection.
 * @param onIntersect - A callback function that will be called when the target element intersects with
 * the viewport.
 * @param {ObserverOptions} [options] - An optional object that contains additional configuration
 * options for the Intersection Observer.
 * @example
 * const targetRef = useRef(null);
 * const onIntersect = () => {
 *  // Do something when the target element intersects with the viewport.
 * };
 * useIntersectionObserver(targetRef, onIntersect);
 */
export const useIntersectionObserver = (
  targetRef: React.RefObject<Element>,
  onIntersect: () => void,
  options?: ObserverOptions
) => {
  const { threshold = 0.85, delay = 0, pauseOnTabChange = true } = options ?? {};

  useEffect(() => {
    const handleIntersect = debounce(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      delay,
      { leading: true, trailing: true }
    );

    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '0px', threshold });

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
  }, [targetRef, onIntersect, options]);
};

/**
 * The `useOtherUser` function returns the other user in a conversation based on the current user's
 * information and the conversation's members.
 * @param {IConversation} conversation - The `conversation` parameter is of type `ConversationType`.
 * It represents a conversation object that contains information about the conversation, such as its
 * members.
 * @returns The function `useOtherUser` returns the other user in a conversation, excluding the current
 * user.
 */
export const useOtherUser = (conversation: IConversation) => {
  const { currentUserInfo } = useCurrentUserInfo();

  return useMemo(() => {
    return conversation?.members?.filter((member) => member._id !== currentUserInfo._id)[0];
  }, [currentUserInfo, conversation?.members]);
};

/**
 * The `useDebounce` function is a custom hook in TypeScript that returns a debounced value based on
 * the input value and delay.
 * @param {T} value - The value that you want to debounce. This can be of any type (T).
 * @param {number} delay - The `delay` parameter is the amount of time in milliseconds that the value
 * should be debounced for. It determines how long the code should wait after the value changes before
 * updating the debounced value.
 * @returns The `useDebounce` function returns the debounced value of the input `value`.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
