import { useEffect, useRef } from 'react';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { App, ConfigProvider, Form, Input } from 'antd';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';

import { REGISTER_SAGA } from '@/redux/ActionSaga/AuthActionSaga';
import { setLoading } from '@/redux/Slice/AuthSlice';
import { IUserRegister } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/special';

import { ButtonActiveHover } from '@/components/MiniComponent';
import StyleProvider from './cssRegister';
import { getTheme } from '@/util/theme';

const Register = () => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();
  const dispatch = useAppDispatch();
  const { notification } = App.useApp();

  const { loading, errorRegister, countErrorRegister } = useAppSelector((state) => state.auth);

  const countRef = useRef(countErrorRegister);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: ''
    }
  });

  const onSubmit = (values: IUserRegister) => {
    dispatch(setLoading(true));
    dispatch(REGISTER_SAGA(values));
  };

  useEffect(() => {
    if (errorRegister && countRef.current < countErrorRegister) {
      notification.error({
        message: 'Register failed!',
        description: errorRegister
      });
      countRef.current = countErrorRegister;
    }
  }, [countErrorRegister]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: themeColorSet.colorText2,
          colorBgBase: themeColorSet.colorBg2,
          lineWidth: 0,
          controlHeight: 40
        }
      }}>
      <StyleProvider theme={themeColorSet} className='w-screen h-screen'>
        <div className='register relative'>
          <div className='cover absolute top-0 left-0'>
            <div className='content'>
              <div className='lineTop mt-5'>
                <span className='anyWhere'>
                  <span className='circle ml-5 mr-2'>
                    <FontAwesomeIcon className='icon' icon={faSnowflake} />
                  </span>
                  <span>DevHub</span>
                </span>
              </div>
              <div className='account mt-12 px-14'>
                <div className='startFree'>START FOR FREE</div>
                <div className='createAccount'>Create new account</div>
                <div className='member mt-3'>
                  <span className='memberEd'>Already a member?</span>
                  <NavLink to='/login'>
                    <span className='login ml-1'>Login</span>
                  </NavLink>
                </div>
                <Form
                  name='register'
                  className='mt-5 formAccount'
                  onFinish={form.handleSubmit(onSubmit)}
                  autoComplete='off'>
                  <Form.Item
                    name='firstname'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your firstname!'
                      }
                    ]}>
                    <Input
                      placeholder='Full name'
                      allowClear
                      prefix={<UserOutlined />}
                      onChange={(e) => {
                        form.setValue('name', e.target.value);
                      }}
                    />
                  </Form.Item>
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
                    ]}
                    hasFeedback>
                    <Input.Password
                      placeholder='Password'
                      onChange={(e) => {
                        form.setValue('password', e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name='confirm'
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!'
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('The two passwords that you entered do not match!')
                          );
                        }
                      })
                    ]}>
                    <Input.Password
                      placeholder='Confirm Password'
                      onChange={(e) => {
                        form.setValue('confirm', e.target.value);
                      }}
                    />
                  </Form.Item>
                  <ButtonActiveHover loading={loading} type='primary' className='buttonCreate mt-3'>
                    Create account
                  </ButtonActiveHover>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Register;
