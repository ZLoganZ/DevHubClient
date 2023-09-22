import { ChangeEvent, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';

import {
  CHECK_RESET_PASSWORD_SAGA,
  CHECK_VERIFY_CODE_SAGA,
  FORGOT_PASSWORD_SAGA,
  RESET_PASSWORD_SAGA,
  VERIFY_CODE_SAGA
} from '@/redux/ActionSaga/AuthActionSaga';
import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppDispatch, useAppSelector } from '@/hooks';
import StyleTotal from './cssForgotPassword';

export const ForgotPassword = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(FORGOT_PASSWORD_SAGA({ email: email }));
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <h1>ForgotPassword</h1>
        <label htmlFor="email" className="mr-3">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChangeEmail}
        />
        <button className="btnNext ml-3 mr-3 px-3 py-1" onClick={handleSubmit}>
          Send
        </button>
        <button
          className="btnBack mr-3 px-3 py-1"
          onClick={() => navigate('/login')}>
          Back
        </button>
      </StyleTotal>
    </ConfigProvider>
  );
};

export const ResetPassword = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const email = params.get('email');

  const [password, setPassword] = useState('');

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    if (!email) {
      navigate('/forgot');
    }

    if (email) {
      dispatch(CHECK_RESET_PASSWORD_SAGA({ email: email }));
    }
  }, [email]);

  const handleSubmit = () => {
    if (password === confirmPassword) {
      dispatch(
        RESET_PASSWORD_SAGA({
          email: email!,
          password: password
        })
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <h1>ResetPassword</h1>
        <label htmlFor="password" className="mr-3">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChangePassword}
        />
        <label htmlFor="confirmPassword" className="mr-3">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          onChange={handleChangeConfirmPassword}
        />
        <button className="btnNext ml-3 mr-3 px-3 py-1" onClick={handleSubmit}>
          Next
        </button>
        <button
          className="btnBack mr-3 px-3 py-1"
          onClick={() => navigate('/forgot')}>
          Back
        </button>
      </StyleTotal>
    </ConfigProvider>
  );
};

export const VerifyCode = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const email = params.get('email');

  const [code, setCode] = useState('');

  const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  useEffect(() => {
    if (!email) {
      navigate('/forgot');
    }

    if (email) {
      dispatch(CHECK_VERIFY_CODE_SAGA({ email: email }));
    }
  }, [email]);

  const handleSubmit = () => {
    if (code === params.get('code')) {
      window.alert(
        'Lêu lêu, bị lừa rồi đó, đừng nhập code này nữa nha, đọc note kìa!'
      );
    }
    dispatch(VERIFY_CODE_SAGA({ email: email!, code: code }));
  };

  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <h1>VerifyCode</h1>
        <label htmlFor="code" className="mr-3">
          Code
        </label>
        <input type="text" name="code" id="code" onChange={handleChangeCode} />
        <button className="btnNext ml-3 mr-3 px-3 py-1" onClick={handleSubmit}>
          Next
        </button>
        <button
          className="btnBack mr-3 px-3 py-1"
          onClick={() => navigate('/forgot')}>
          Back
        </button>
      </StyleTotal>
    </ConfigProvider>
  );
};
