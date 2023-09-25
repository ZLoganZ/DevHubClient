import { theme } from 'antd';

import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';
import {
  lightTheme,
  darkTheme,
  darkThemeSet,
  lightThemeSet
} from '@/util/cssVariable';

export const getTheme = () => {
  let themeLocal = localStorage.getItem('theme');
  switch (themeLocal) {
    case DARK_THEME: {
      return {
        themeColor: darkTheme,
        themeColorSet: darkThemeSet,
        algorithm: theme.darkAlgorithm
      };
    }
    case LIGHT_THEME: {
      return {
        themeColor: lightTheme,
        themeColorSet: lightThemeSet,
        algorithm: theme.defaultAlgorithm
      };
    }
    default: {
      return {
        themeColor: darkTheme,
        themeColorSet: darkThemeSet,
        algorithm: theme.darkAlgorithm
      };
    }
  }
};
