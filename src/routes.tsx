import { CommunityWrapper, PostWrapper, ProfileWrapper } from '@/Wrapper';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AlternativeLogin from '@/pages/Login/AlternativeLogin';
import { ForgotPassword, ResetPassword, VerifyCode } from '@/pages/ForgotPassword';
import NewsFeed from '@/pages/NewsFeed/NewsFeed';
import Chat from '@/pages/Chat';
import SelectInterest from '@/pages/SelectInterest';
import SelectAddFriend from '@/pages/SelectAddFriend';
import SelectCommunity from '@/pages/SelectCommunity';
import GetStarted from '@/pages/GetStarted';
import NotFound404 from '@/pages/NotFound404';
import SavedPosts from '@/pages/SavedPosts';
import Search from '@/pages/Search/Search';

import { VoiceCall, VideoCall } from '@/components/ChatComponents/MessageCall';
import RepoCallback from '@/components/Form/AddRepositoryForm/RepoCallback';

import MainLayout from '@/layouts/MainLayout';

export const privateRoutes = [
  {
    path: '/',
    element: <MainLayout Component={<NewsFeed />} />
  },
  {
    path: '/search/top',
    element: <MainLayout Component={<Search />} />
  },
  {
    path: '/message/:conversationID?',
    element: <Chat />
  },
  {
    path: '/select-interest',
    element: <SelectInterest />
  },
  {
    path: '/select-add-friend',
    element: <SelectAddFriend />
  },
  {
    path: '/select-community',
    element: <SelectCommunity />
  },
  {
    path: '/get-started',
    element: <GetStarted />
  },
  {
    path: '/user/:userID',
    element: <MainLayout Component={<ProfileWrapper />} />
  },
  {
    path: '/me',
    element: <MainLayout Component={<ProfileWrapper />} />
  },
  {
    path: '/bookmark',
    element: <MainLayout Component={<SavedPosts />} />
  },
  {
    path: '/post/:postID',
    element: <MainLayout Component={<PostWrapper />} />
  },
  {
    path: '/community/:communityID',
    element: <MainLayout Component={<CommunityWrapper />} />
  },
  {
    path: '/call/:conversationID?/voice',
    element: <VoiceCall />
  },
  {
    path: '/call/:conversationID?/video',
    element: <VideoCall />
  },
  {
    path: '/repo-callback',
    element: <RepoCallback />
  },
  {
    path: '*',
    element: <NotFound404 />
  }
];

export const publicRoutes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/login-callback',
    element: <AlternativeLogin />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot',
    element: <ForgotPassword />
  },
  {
    path: '/verify',
    element: <VerifyCode />
  },
  {
    path: '/reset',
    element: <ResetPassword />
  },
  {
    path: '*',
    element: <NotFound404 />
  }
];
