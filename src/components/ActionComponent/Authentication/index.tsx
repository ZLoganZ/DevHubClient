import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks/special';

export const NotAuth = () => {
  const location = useLocation();

  const user = useAppSelector((state) => state.auth.userID);

  if (user) return <Navigate to='/' replace state={{ from: location }} />;
  else return <Outlet />;
};

export const Auth = () => {
  const location = useLocation();

  const user = useAppSelector((state) => state.auth.userID);

  if (!user) return <Navigate to='/login' replace state={{ from: location }} />;
  else return <Outlet />;
};
