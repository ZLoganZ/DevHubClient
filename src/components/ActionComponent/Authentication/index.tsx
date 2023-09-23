import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingLogo from '@/components/GlobalSetting/LoadingLogo';
import { useAppDispatch, useAppSelector } from '@/hooks/special';

export const AlreadyAuth = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const login = useAppSelector((state) => state.authReducer.login);

  if (login === null) {
    return <LoadingLogo />;
  }

  if (login === true) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const Auth = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const login = useAppSelector((state) => state.authReducer.login);

  if (login === null) {
    return <LoadingLogo />;
  }

  if (login === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
