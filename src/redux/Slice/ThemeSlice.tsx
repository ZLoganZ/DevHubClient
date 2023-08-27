import { createSlice } from "@reduxjs/toolkit";
import { DARK_THEME, LIGHT_THEME } from "../../util/constants/SettingSystem";

const initialState = {
  change: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      switch (action.payload.theme) {
        case DARK_THEME: {
          localStorage.setItem("theme", DARK_THEME);
          state.change = !state.change;
          break;
        }
        case LIGHT_THEME: {
          localStorage.setItem("theme", LIGHT_THEME);
          state.change = !state.change;
          break;
        }
        default: {
          localStorage.setItem("theme", DARK_THEME);
          state.change = !state.change;
          break;
        }
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
