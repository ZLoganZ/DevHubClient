import { theme } from 'antd';

import { LIGHT_THEME } from '@/util/constants/SettingSystem';
import {
  lightTheme,
  darkTheme,
  darkThemeSet,
  lightThemeSet
} from '@/util/cssVariable';

export const getTheme = () => {
  const themeLocal = localStorage.getItem('theme');
  const themeSet = themeLocal === LIGHT_THEME ? lightTheme : darkTheme;
  const algorithm =
    themeLocal === LIGHT_THEME ? theme.defaultAlgorithm : theme.darkAlgorithm;
  return {
    themeColor: themeSet,
    themeColorSet: themeSet === lightTheme ? lightThemeSet : darkThemeSet,
    algorithm
  };
};
