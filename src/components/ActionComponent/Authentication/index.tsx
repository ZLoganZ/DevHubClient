import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingLogo from '@/components/GlobalSetting/LoadingLogo';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { CHECK_LOGIN_SAGA } from '@/redux/ActionSaga/AuthActionSaga';

export const AlreadyAuth = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const login = useAppSelector((state) => state.authReducer.login);

  useEffect(() => {
    if (login !== null) return;

    dispatch(CHECK_LOGIN_SAGA());
  }, []);

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

  useEffect(() => {
    if (login !== null) return;

    dispatch(CHECK_LOGIN_SAGA());
  }, []);

  if (login === null) {
    return <LoadingLogo />;
  }

  if (login === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
