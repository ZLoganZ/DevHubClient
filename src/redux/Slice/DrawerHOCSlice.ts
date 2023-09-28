import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  visible: false,
  ComponentContentDrawer: null,
  callBackSubmit: () => {},
  loading: false
};

const drawerHOCSlide = createSlice({
  name: 'post',
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      return {
        ...state,
        title: action.payload.title,
        visible: true,
        ComponentContentDrawer: action.payload.component
      };
    },
    closeDrawer: (state) => {
      return {
        ...state,
        visible: false
      };
    },
    callBackSubmitDrawer: (state, action) => {
      return {
        ...state,
        callBackSubmit: action.payload
      };
    },
    setLoading: (state, action) => {
      return { ...state, loading: action.payload };
    }
  }
});

export const { openDrawer, callBackSubmitDrawer, closeDrawer, setLoading } = drawerHOCSlide.actions;
export default drawerHOCSlide.reducer;
