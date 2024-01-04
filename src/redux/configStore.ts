import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './Saga/rootSaga';

import auth from './Slice/AuthSlice';
import hook from './Slice/HookSlice';
import theme from './Slice/ThemeSlice';
import drawerHOC from './Slice/DrawerHOCSlice';
import modalHOC from './Slice/ModalHOCSlice';
import socketIO from './Slice/SocketSlice';
import getStarted from './Slice/GetStartedSlice';
import community from './Slice/CommunitySlide';
import comment from './Slice/CommentSlice';
import message from './Slice/MessageSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth,
    hook,
    theme,
    drawerHOC,
    modalHOC,
    socketIO,
    getStarted,
    community,
    comment,
    message
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'hook/setNavigate',
          'hook/setLocation',
          'hook/setUseSelector',
          'hook/setDispatch',
          'comment/setHandleParentInput',
          'comment/setHandleChildInput',
          'post/openDrawer',
          'post/callBackSubmitDrawer',
          'post/setHandleSubmit',
          'post/openModal',
          'post/callBackSubmitModal'
        ],
        ignoredPaths: ['hook', 'drawerHOC', 'modalHOC', 'socketIO', 'comment']
      }
    }).concat(sagaMiddleware as any)
});

// Hàm run nhận vào 1 generator hook
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
