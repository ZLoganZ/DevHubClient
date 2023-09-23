import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  setDispatch,
  setLocation,
  setNavigate,
  setUseSelector
} from '@/redux/Slice/FunctionSlice';

import { useAppDispatch, useAppSelector } from './hooks/special';

import ModalHOC from '@/HOC/Modal/ModalHOC';
import DrawerHOC from '@/HOC/Drawer/DrawerHOC';

import ActiveStatus from '@/components/ActionComponent/ActiveStatus';
import {
  CommunityWrapper,
  PostWrapper,
  ProfileWrapper
} from '@/components/Wrapper';
import { AlreadyAuth, Auth } from '@/components/ActionComponent/Authentication';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import {
  ForgotPassword,
  ResetPassword,
  VerifyCode
} from '@/pages/ForgotPassword';
import NewsFeed from '@/pages/NewsFeed/NewsFeed';
import Chat from '@/pages/Chat';
import SelectInterest from '@/pages/SelectInterest';
import SelectFollow from '@/pages/SelectFollow';
import SelectCommunity from '@/pages/SelectCommunity';
import GetStarted from '@/pages/GetStarted';
import NotFound404 from '@/pages/NotFound404';

import MainLayout from '@/layouts/MainLayout';

const App = () => {
  //Set một số tham số cần thiết trên toàn cục
  const dispatch = useAppDispatch();
  dispatch(setDispatch(dispatch));

  const navigate = useNavigate();
  dispatch(setNavigate(navigate));

  const location = useLocation();
  dispatch(setLocation(location));

  dispatch(setUseSelector(useAppSelector));

  const routes = [
    {
      path: '/login',
      mainLayout: false,
      component: <Login />
    },
    {
      path: '/register',
      mainLayout: false,
      component: <Register />
    },
    {
      path: '/forgot',
      mainLayout: false,
      component: <ForgotPassword />
    },
    {
      path: '/verify',
      mainLayout: false,
      component: <VerifyCode />
    },
    {
      path: '/reset',
      mainLayout: false,
      component: <ResetPassword />
    },
    {
      path: '/',
      mainLayout: true,
      component: <NewsFeed />
    },
    {
      path: '/message/:conversationID?',
      mainLayout: false,
      component: <Chat />
    },
    {
      path: '/select-interest',
      mainLayout: false,
      component: <SelectInterest />
    },
    {
      path: '/select-follow',
      mainLayout: false,
      component: <SelectFollow />
    },
    {
      path: '/select-community',
      mainLayout: false,
      component: <SelectCommunity />
    },
    {
      path: '/get-started',
      mainLayout: false,
      component: <GetStarted />
    },
    {
      path: '/user/:userID',
      mainLayout: true,
      component: <ProfileWrapper />
    },
    {
      path: '/me',
      mainLayout: true,
      component: <ProfileWrapper />
    },
    {
      path: '/post/:postID',
      mainLayout: true,
      component: <PostWrapper />
    },
    {
      path: '/community/:communityID',
      mainLayout: true,
      component: <CommunityWrapper />
    },
    {
      path: '*',
      mainLayout: false,
      component: <NotFound404 />
    }
  ];

  return (
    <>
      <ModalHOC />
      <DrawerHOC />
      <ActiveStatus />
      <Routes>
        {/* <Route element={<AlreadyAuth />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/reset" element={<ResetPassword />} />
        </Route>
        <Route element={<Auth />}>
        <Route index element={<MainLayout Component={NewsFeed} />} />
        <Route path="/message/:conversationID?" element={<Chat />} />
        <Route path="/select-interest" element={<SelectInterest />} />
        <Route path="/select-follow" element={<SelectFollow />} />
        <Route path="/select-community" element={<SelectCommunity />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route
          path="/user/:userID"
          element={<MainLayout Component={ProfileWrapper} />}
        />
        <Route path="/me" element={<MainLayout Component={ProfileWrapper} />} />
        <Route
          path="/post/:postID"
          element={<MainLayout Component={PostWrapper} />}
        />
        <Route
          path="/community/:communityID"
          element={<MainLayout Component={CommunityWrapper} />}
        />
        <Route path="*" element={<NotFound404 />} />
        </Route> */}
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                route.mainLayout ? (
                  <MainLayout Component={route.component} />
                ) : (
                  route.component
                )
              }
            />
          );
        })}
      </Routes>
    </>
  );
};

export default App;
