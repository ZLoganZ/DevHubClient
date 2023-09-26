import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  type: '',
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
        type: action.payload.type,
        visible: true,
        ComponentContentModal: action.payload.component,
        footer: action.payload.footer
      };
    },
    setFooter: (state, action) => {
      return {
        ...state,
        footer: action.payload
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

export const { openModal, setFooter, closeModal, setHandleSubmit } =
  modalHOCSlide.actions;
export default modalHOCSlide.reducer;
