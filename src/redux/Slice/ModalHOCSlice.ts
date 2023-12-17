import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  type: '',
  visible: false,
  ComponentContentModal: null,
  footer: null,
  handleSubmit: () => {},
  data: {
    isReply: false,
    idComment: null,
    parentUser: '',
    name: null,
    user_image: null
  }
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
        visible: false,
        data: {
          isReply: false,
          idComment: null,
          parentUser: '',
          name: null,
          user_image: null
        }
      };
    },
    setHandleSubmit: (state, action) => {
      return {
        ...state,
        handleSubmit: action.payload
      };
    },
    setData: (state, action) => {
      return {
        ...state,
        data: action.payload
      };
    }
  }
});

export const { openModal, setFooter, closeModal, setHandleSubmit, setData } = modalHOCSlide.actions;
export default modalHOCSlide.reducer;
