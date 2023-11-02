import { createSlice } from '@reduxjs/toolkit';
import { DARK_THEME, LIGHT_THEME } from '@/util/constants/SettingSystem';

const initialState = {
  changed: true,
  theme: localStorage.getItem('theme') ?? DARK_THEME
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      switch (action.payload.theme) {
        case DARK_THEME: {
          localStorage.setItem('theme', DARK_THEME);
          state.changed = !state.changed;
          state.theme = DARK_THEME;
          break;
        }
        case LIGHT_THEME: {
          localStorage.setItem('theme', LIGHT_THEME);
          state.changed = !state.changed;
          state.theme = LIGHT_THEME;
          break;
        }
        default: {
          localStorage.setItem('theme', DARK_THEME);
          state.changed = !state.changed;
          state.theme = DARK_THEME;
          break;
        }
      }
    }
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
