import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  visible: false,
  ComponentContentModal: null,
  footer: null,
  handleSubmit: () => {}
};

const modalHOCSlide = createSlice({
  name: 'post',
  initialState,
  reducers: {
    openModal: (state, action) => {
      return {
        ...state,
        title: action.payload.title,
        visible: true,
        ComponentContentModal: action.payload.component,
        footer: action.payload.footer
      };
    },
    closeModal: (state) => {
      return {
        ...state,
        visible: false
      };
    },
    setHandleSubmit: (state, action) => {
      return {
        ...state,
        handleSubmit: action.payload
      };
    }
  }
});

export const { openModal, closeModal, setHandleSubmit } = modalHOCSlide.actions;
export default modalHOCSlide.reducer;
