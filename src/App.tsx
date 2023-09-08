import { useDispatch, useSelector } from "react-redux";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  setDispatch,
  setLocation,
  setNavigate,
  setUseSelector,
} from "@/redux/Slice/FunctionSlice";
import ModalHOC from "@/HOC/Modal/ModalHOC";
import DrawerHOC from "@/HOC/Drawer/DrawerHOC";
import ActiveStatus from "@/components/ActionComponent/ActiveStatus";
import { AlreadyAuth, Auth } from "@/components/ActionComponent/Authentication";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import {
  ForgotPassword,
  ResetPassword,
  VerifyCode,
} from "@/pages/ForgotPassword";
import MainLayout from "@/layouts/MainLayout";
import NewsFeed from "@/pages/NewsFeed/NewsFeed";
import Chat from "@/pages/Chat";
import SelectInterest from "@/pages/SelectInterest";
import SelectFollow from "@/pages/SelectFollow";
import SelectCommunity from "@/pages/SelectCommunity";
import GetStarted from "@/pages/GetStarted";
import { CommunityWrapper, PostShareWrapper, PostWrapper, ProfileWrapper } from "@/components/Wrapper";
import NotFound404 from "@/pages/NotFound404";

const App = () => {
  //Set một số tham số cần thiết trên toàn cục
  const dispatch = useDispatch();
  dispatch(setDispatch(dispatch));

  const navigate = useNavigate();
  dispatch(setNavigate(navigate));

  const location = useLocation();
  dispatch(setLocation(location));

  dispatch(setUseSelector(useSelector));

  return (
    <>
      <ModalHOC />
      <DrawerHOC />
      <ActiveStatus />
      <Routes>
        <Route element={<AlreadyAuth />}>
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
          <Route
            path="/me"
            element={<MainLayout Component={ProfileWrapper} />}
          />
          <Route
            path="/post/:postID"
            element={<MainLayout Component={PostWrapper} />}
          />
          <Route
            path="/postshare/:postID"
            element={<MainLayout Component={PostShareWrapper} />}
          />
          <Route
            path="/community/:communityID"
            element={<MainLayout Component={CommunityWrapper} />}
          />
          <Route path="*" element={<NotFound404 />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
