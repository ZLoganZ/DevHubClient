import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './Saga/rootSaga';

import auth from './Slice/AuthSlice';
import hook from './Slice/HookSlice';
import theme from './Slice/ThemeSlice';
import drawerHOC from './Slice/DrawerHOCSlice';
import modalHOC from './Slice/ModalHOCSlice';
import socketIO from './Slice/SocketSlice';
import conversation from './Slice/ConversationSlice';
import getStarted from './Slice/GetStartedSlice';
import community from './Slice/CommunitySlide';
import comment from './Slice/CommentSlice';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const store = configureStore({
  reducer: {
    auth,
    hook,
    theme,
    drawerHOC,
    modalHOC,
    socketIO,
    conversation,
    getStarted,
    community,
    comment,
    activeList
  },
  middleware
});

// Hàm run nhận vào 1 generator hook
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
