import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CHECK_RESET_PASSWORD_SAGA,
  CHECK_VERIFY_CODE_SAGA,
  FORGOT_PASSWORD_SAGA,
  RESET_PASSWORD_SAGA,
  VERIFY_CODE_SAGA
} from '@/redux/ActionSaga/AuthActionSaga';
import { getTheme } from '@/util/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import StyleProvider from './cssForgotPassword';
import { Input } from 'antd';

export const ForgotPassword = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(FORGOT_PASSWORD_SAGA({ email: email }));
  };

  return (
    <StyleProvider theme={themeColorSet}>
      <div id='content' role='main' className='w-full max-w-md mx-auto p-6'>
        <div className='mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300'>
          <div className='p-4 sm:p-7'>
            <div className='text-center'>
              <h1 className='block text-2xl font-bold text-gray-800 dark:text-white'>Forgot password?</h1>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Remember your password?&nbsp;
                <span
                  className='text-blue-600 decoration-2 hover:underline font-medium cursor-pointer'
                  onClick={() => navigate('/login')}>
                  Login here
                </span>
              </p>
            </div>

            <div className='mt-5'>
              <div className='grid gap-y-4'>
                <div>
                  <label htmlFor='email' className='block text-sm font-bold ml-1 mb-2 dark:text-white'>
                    Email address
                  </label>
                  <div className='relative'>
                    <Input
                      type='email'
                      id='email'
                      name='email'
                      placeholder='Enter your email address'
                      className='py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm'
                      required
                      aria-describedby='email-error'
                      onChange={handleChangeEmail}
                    />
                  </div>
                  <p className='hidden text-xs text-red-600 mt-2' id='email-error'>
                    Please include a valid email address so we can get back to you
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'>
                  Reset password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export const ResetPassword = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const email = params.get('email');

  const [password, setPassword] = useState('');

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <StyleProvider theme={themeColorSet}>
      <div id='content' role='main' className='w-full max-w-md mx-auto p-6'>
        <div className='mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300'>
          <div className='p-4 sm:p-7'>
            <div className='text-center'>
              <h1 className='block text-2xl font-bold text-gray-800 dark:text-white'>Reset your password</h1>
            </div>

            <div className='mt-5'>
              <div className='grid gap-y-4'>
                <div>
                  <label htmlFor='password' className='block text-sm font-bold ml-1 mb-2 dark:text-white'>
                    Password
                  </label>
                  <div className='relative'>
                    <Input
                      type='password'
                      id='password'
                      name='password'
                      placeholder='Enter your password'
                      className='py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm'
                      required
                      aria-describedby='email-error'
                      onChange={handleChangePassword}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-bold ml-1 mb-2 dark:text-white'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <Input
                      type='password'
                      id='confirmPassword'
                      name='confirmPassword'
                      placeholder='Enter your confirm password'
                      className='py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm'
                      required
                      onChange={handleChangeConfirmPassword}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'>
                  Reset password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};

export const VerifyCode = () => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const email = params.get('email');

  const [code, setCode] = useState('');

  const [inputValues, setInputValues] = useState<string[]>(['', '', '', '', '', '', '', '']);

  const handleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);

    if (index < inputValues.length - 1 && e.target.value) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    const str = newInputValues.join('');
    setCode(str);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    const pastedArray = pastedData.split('').slice(0, inputValues.length);

    setInputValues(pastedArray);
    setCode(pastedData);

    const nextInput = document.getElementById(`input-${inputValues.length - 1}`);
    if (nextInput) {
      nextInput.focus();
    }
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
      window.alert('Lêu lêu, bị lừa rồi đó, đừng nhập code này nữa nha, đọc note kìa!');
    }
    dispatch(VERIFY_CODE_SAGA({ email: email!, code: code }));
  };

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleResendOTP = () => {
    if (!isResendDisabled) {
      setInputValues(['', '', '', '', '', '', '', '']);
      dispatch(FORGOT_PASSWORD_SAGA({ email: email! }));

      // Disable the resend button
      setIsResendDisabled(true);

      // Enable the resend button after 60 seconds
      setTimeout(() => {
        setIsResendDisabled(false);
      }, 60000); // 60000 milliseconds = 60 seconds

      setCountdown(60);
    }
  };

  return (
    <StyleProvider theme={themeColorSet}>
      <div className='pt-20'>
        <div className='max-w-lg mx-auto border rounded'>
          <div className='shadow-md px-4 py-6'>
            <div className='flex justify-center gap-2 mb-6'>
              {inputValues.map((value, index) => (
                <input
                  key={index}
                  id={`input-${index}`}
                  className='w-12 h-12 text-center font-bold text-lg border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500'
                  type='text'
                  maxLength={1}
                  autoComplete='one-time-code'
                  value={value}
                  onChange={handleInputChange(index)}
                  onPaste={handlePaste}
                  required
                />
              ))}
            </div>
            <div className='flex items-center justify-center'>
              <button
                className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                onClick={handleSubmit}>
                Verify
              </button>
              <button
                className='inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800 ml-4'
                onClick={handleResendOTP}
                disabled={isResendDisabled}>
                Resend OTP {isResendDisabled ? '(' + countdown + 's)' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </StyleProvider>
  );
};
