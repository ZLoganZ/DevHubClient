import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks/special';
import { AUTHORIZATION } from '@/util/constants/SettingSystem';

export const NotAuth = () => {
  const location = useLocation();

  const userID = useAppSelector((state) => state.auth.userID);

  if (userID !== 'Méo có UserID!') return <Navigate to='/' replace state={{ from: location }} />;

  localStorage.removeItem(AUTHORIZATION);
  return <Outlet />;
};

export const Auth = () => {
  const location = useLocation();

  const userID = useAppSelector((state) => state.auth.userID);

  if (userID === 'Méo có UserID!') {
    localStorage.removeItem(AUTHORIZATION);
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};
