import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const merge = (...args: ClassValue[]) => {
  return twMerge(clsx(args));
};

export default merge;
