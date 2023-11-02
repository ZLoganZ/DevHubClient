import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { setDispatch, setLocation, setNavigate, setUseSelector } from '@/redux/Slice/HookSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/special';

import ModalHOC from '@/HOC/Modal/ModalHOC';
import DrawerHOC from '@/HOC/Drawer/DrawerHOC';

import { NotAuth, Auth } from '@/components/ActionComponent/Authentication';
import { ChatService, PresenceService } from '@/components/ActionComponent/SocketService';
import { VoiceCall, VideoCall } from '@/components/ChatComponents/MessageCall';

import { CommunityWrapper, PostWrapper, ProfileWrapper } from '@/Wrapper';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { ForgotPassword, ResetPassword, VerifyCode } from '@/pages/ForgotPassword';
import NewsFeed from '@/pages/NewsFeed/NewsFeed';
import Chat from '@/pages/Chat';
import SelectInterest from '@/pages/SelectInterest';
import SelectFollow from '@/pages/SelectFollow';
import SelectCommunity from '@/pages/SelectCommunity';
import GetStarted from '@/pages/GetStarted';
import NotFound404 from '@/pages/NotFound404';
import MainLayout from '@/layouts/MainLayout';

const App = () => {
  const dispatch = useAppDispatch();
  dispatch(setDispatch(dispatch));

  dispatch(setUseSelector(useAppSelector));

  dispatch(setNavigate(useNavigate()));

  dispatch(setLocation(useLocation()));

  return (
    <>
      <ModalHOC />
      <DrawerHOC />
      <PresenceService />
      <ChatService />

      <Routes>
        <Route element={<NotAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot' element={<ForgotPassword />} />
          <Route path='/verify' element={<VerifyCode />} />
          <Route path='/reset' element={<ResetPassword />} />
        </Route>
        <Route element={<Auth />}>
          <Route index element={<MainLayout Component={<NewsFeed />} />} />
          <Route path='/message/:conversationID?' element={<Chat />} />
          <Route path='/select-interest' element={<SelectInterest />} />
          <Route path='/select-follow' element={<SelectFollow />} />
          <Route path='/select-community' element={<SelectCommunity />} />
          <Route path='/get-started' element={<GetStarted />} />
          <Route path='/user/:userID' element={<MainLayout Component={<ProfileWrapper />} />} />
          <Route path='/me' element={<MainLayout Component={<ProfileWrapper />} />} />
          <Route path='/post/:postID' element={<MainLayout Component={<PostWrapper />} />} />
          <Route path='/community/:communityID' element={<MainLayout Component={<CommunityWrapper />} />} />
          <Route path='/call/:conversationID?/voice' element={<VoiceCall />} />
          <Route path='/call/:conversationID?/video' element={<VideoCall />} />
          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
