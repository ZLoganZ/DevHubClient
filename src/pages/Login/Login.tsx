import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-regular-svg-icons';
import { ConfigProvider, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { NavLink, useLocation } from 'react-router-dom';

import { LOGIN_SAGA, LOGIN_WITH_GOOGLE_SAGA } from '@/redux/ActionSaga/AuthActionSaga';
import { setLoading } from '@/redux/Slice/AuthSlice';
import { GetGitHubUrl } from '@/util/getGithubUrl';
import { AUTHORIZATION, GITHUB_TOKEN } from '@/util/constants/SettingSystem';
import { darkThemeSet } from '@/util/cssVariable';
import { useAppDispatch, useAppSelector } from '@/hooks/special';
import { UserLoginDataType } from '@/types';

import { ButtonActiveHover } from '@/components/MiniComponent';
import StyleProvider from './cssLogin';

const Login = () => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  const location = useLocation();

  const handleSignInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      dispatch(
        LOGIN_WITH_GOOGLE_SAGA({
          token: tokenResponse.access_token
        })
      );
    }
  });

  const openPopup = () => {
    const width = 500; // Width of the pop-up window
    const height = 800; // Height of the pop-up window
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      GetGitHubUrl(),
      'GithubAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === import.meta.env.VITE_SERVER_ENDPOINT) {
        // Check the origin of the message for security
        // Handle the received data from the server
        const userData = event.data;
        if (userData) {
          localStorage.setItem(AUTHORIZATION, userData.accessToken);
          localStorage.setItem(GITHUB_TOKEN, userData.accessTokenGitHub);

          // go to home page or redirect to previous page
          const state = location.state as { from: Location };
          const from = state?.from?.pathname || '/';

          window.location.replace(from);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const pollOAuthStatus = setInterval(() => {
      if (popup?.closed) {
        clearInterval(pollOAuthStatus);
        window.removeEventListener('message', handleMessage);
      }
    }, 500);
  };

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: UserLoginDataType) => {
    dispatch(setLoading(true));
    dispatch(LOGIN_SAGA(values));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: darkThemeSet.colorText2,
          colorBgBase: darkThemeSet.colorBg2,
          lineWidth: 0,
          controlHeight: 40,
          borderRadius: 0
        }
      }}>
      <StyleProvider>
        <div className='login'>
          <div className='loginForm'>
            <div className='welcomeBack mb-12'>
              <div className='icon_logo'>
                <FontAwesomeIcon className='icon' icon={faSnowflake} />
              </div>
              <h2 className='title'>Welcome back!</h2>
            </div>

            <Form
              name='login'
              className='w-full'
              style={{ width: '70%' }}
              onFinish={form.handleSubmit(onSubmit)}
              autoComplete='off'>
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  },
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!'
                  }
                ]}>
                <Input
                  placeholder='Email'
                  allowClear
                  prefix={<MailOutlined />}
                  onChange={(e) => {
                    form.setValue('email', e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!'
                  }
                ]}>
                <Input.Password
                  placeholder='Password'
                  onChange={(e) => {
                    form.setValue('password', e.target.value);
                  }}
                />
              </Form.Item>
              <ButtonActiveHover
                loading={loading}
                type='primary'
                className='btn w-full h-9 mb-4 mt-3 font-bold'>
                Login
              </ButtonActiveHover>
              <NavLink to='/forgot'>
                <span className='forgot flex justify-center align-middle'>Forgot your password?</span>
              </NavLink>
            </Form>
            <div className='anotherLogin mt-10'>
              <div className='title relative'>
                <span className='absolute' style={{ color: darkThemeSet.colorText2 }}>
                  Or
                </span>
                <hr />
              </div>
              <div className='loginTool mt-10 w-full'>
                <div className='google h-10' onClick={() => handleSignInWithGoogle()}>
                  <span className='icon mr-2'>
                    <img src='/SVG/google.svg' alt='google' />
                  </span>
                  <span>Continue with Gmail</span>
                </div>
                <div className='github mt-4 h-10' onClick={() => openPopup()}>
                  <span className='icon mr-2'>
                    <img src='/SVG/github.svg' alt='github' />
                  </span>
                  <span>Continue with Github</span>
                </div>
              </div>
            </div>

            <div className='noAccount text-center mt-8'>
              <span>Don't you have an account yet? </span>
              <span className='signUp ml-1'>
                <NavLink to='/register'>Sign up</NavLink>
              </span>
            </div>
          </div>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Login;
