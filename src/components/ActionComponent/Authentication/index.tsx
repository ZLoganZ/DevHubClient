import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingLogo from '@/components/GlobalSetting/LoadingLogo';
import { AppDispatch, RootState } from '@/redux/configStore';
import { CHECK_LOGIN_SAGA } from '@/redux/ActionSaga/AuthActionSaga';

export const AlreadyAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();

  const login = useSelector((state: RootState) => state.authReducer.login);

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
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();

  const login = useSelector((state: RootState) => state.authReducer.login);

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
