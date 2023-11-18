import { css } from 'styled-components';

// --------------------------------------------

export const darkTheme = {
  colorTextBase: '#d4d4d4',
  colorBgBase: '#1D1D1D',

  controlItemBgActive: '#3b3a3a'
};
export const darkThemeSet = {
  colorText1: '#FFFFFFD9',
  colorText2: '#d4d4d4',
  colorText3: '#FFFFFF73',
  colorText4: '#6b6b70',
  colorBg1: '#0a0a0a',
  colorBg2: '#1D1D1D',
  colorBg3: '#4B4B4B',
  colorBg4: '#3b3a3a',

  colorTextReverse1: '#101011',
  colorTextReverse2: '#1f1f23',
  colorTextReverse3: '#414149',
  colorBgReverse1: '#F0F2F5',
  colorBgReverse2: '#FFFFFF',
  colorBgReverse3: '#E4E5EB',
  colorBgReverse4: '#D8D9DF',

  colorSVG: `invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)`,
  colorPicker: 'dark'
};

//--------------------------------------------

export const lightTheme = {
  colorTextBase: '#1f1f23',
  colorBgBase: '#FFFFFF',

  controlItemBgActive: '#d7d7d7'
};
export const lightThemeSet = {
  colorText1: '#101011',
  colorText2: '#1f1f23',
  colorText3: '#414149',
  colorText4: '#6b6b70',
  colorBg1: '#F0F2F5',
  colorBg2: '#FFFFFF',
  colorBg3: '#E4E5EB',
  colorBg4: '#D8D9DF',

  colorTextReverse1: '#FFFFFFD9',
  colorTextReverse2: '#d4d4d4',
  colorTextReverse3: '#FFFFFF73',
  colorBgReverse1: '#0a0a0a',
  colorBgReverse2: '#1D1D1D',
  colorBgReverse3: '#4B4B4B',
  colorBgReverse4: '#3b3a3a',

  colorSVG: `invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)`,
  colorPicker: 'light'
};

//--------------------------------------------

export const commonColor = {
  colorBlue1: '#1f67e3',
  colorBlue2: '#2468dc',
  colorBlue3: '#1f57b8',
  colorGreen1: '#00ae8c',
  colorRed1: '#c2032f',
  colorRed2: '#aa052c',
  colorWhite1: '#FFFFFFD9',
  colorWhite2: '#d4d4d4',
  colorWarning1: '#ff6b6b'
};

//--------------------------------------------

export const flex_center_column = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const flex_center_row = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const change_color_autoFill = css`
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${(props) => props.theme.colorBg2} inset !important;
    -webkit-text-fill-color: ${(props) => props.theme.colorText1} !important;
  }
`;
export const custom_scrollBar = css`
  &::-webkit-scrollbar {
    border-radius: 0.5rem;
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: ${(props) => props.theme.colorBg2};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: ${(props) => props.theme.colorBg4};
  }
`;

export const custom_scrollBar_modal = css`
  &::-webkit-scrollbar {
    display: none;
  }
`;
