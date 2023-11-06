import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { setDispatch, setLocation, setNavigate, setUseSelector } from '@/redux/Slice/HookSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/special';

import ModalHOC from '@/HOC/Modal/ModalHOC';
import DrawerHOC from '@/HOC/Drawer/DrawerHOC';

import { NotAuth, Auth } from '@/components/ActionComponent/Authentication';
import { ChatService, PresenceService } from '@/components/ActionComponent/SocketService';
import ErrorHandler from '@/components/ErrorHandler';

import { privateRoutes, publicRoutes } from './routes';

const App = () => {
  const dispatch = useAppDispatch();
  dispatch(setDispatch(dispatch));

  dispatch(setUseSelector(useAppSelector));

  dispatch(setNavigate(useNavigate()));

  dispatch(setLocation(useLocation()));

  return (
    <ErrorBoundary fallbackRender={ErrorHandler}>
      <ModalHOC />
      <DrawerHOC />
      <PresenceService />
      <ChatService />

      <Routes>
        <Route element={<NotAuth />}>
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<Auth />}>
          {privateRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
