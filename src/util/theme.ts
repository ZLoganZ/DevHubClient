import { LIGHT_THEME } from '@/util/constants/SettingSystem';
import {
  lightTheme,
  darkTheme,
  darkThemeSet,
  lightThemeSet
} from '@/util/cssVariable';

export const getTheme = () => {
  const themeLocal = localStorage.getItem('theme');
  const themeColor = themeLocal === LIGHT_THEME ? lightTheme : darkTheme;
  const themeColorSet =
    themeColor === lightTheme ? lightThemeSet : darkThemeSet;

  return {
    themeColor,
    themeColorSet
  };
};
