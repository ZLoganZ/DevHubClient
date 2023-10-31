import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks/special';
import { AUTHORIZATION } from '@/util/constants/SettingSystem';

const NO_USER_ID = 'Méo có UserID!';

export const NotAuth = () => {
  const location = useLocation();
  const userID = useAppSelector((state) => state.auth.userID);

  if (userID !== NO_USER_ID) {
    return <Navigate to='/' replace state={{ from: location }} />;
  }

  localStorage.removeItem(AUTHORIZATION);
  return <Outlet />;
};

export const Auth = () => {
  const location = useLocation();
  const userID = useAppSelector((state) => state.auth.userID);

  if (userID === NO_USER_ID) {
    localStorage.removeItem(AUTHORIZATION);
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
