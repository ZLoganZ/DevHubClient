import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { ConfigProvider, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';

import { darkThemeSet } from '@/util/cssVariable';
import { REGISTER_SAGA } from '@/redux/ActionSaga/AuthActionSaga';
import { UserRegisterType } from '@/types';
import { AppDispatch } from '@/redux/configStore';

import StyleTotal from './cssRegister';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirm: ''
    }
  });

  const onSubmit = (values: UserRegisterType) => {
    dispatch(REGISTER_SAGA(values));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: darkThemeSet.colorText2,
          colorBgBase: darkThemeSet.colorBg2,
          lineWidth: 0,
          controlHeight: 40
        }
      }}>
      <StyleTotal className="w-screen h-screen">
        <div className="register relative">
          <div className="cover absolute top-0 left-0">
            <div className="content">
              <div className="lineTop mt-5">
                <span className="anyWhere">
                  <span className="circle ml-5 mr-2">
                    <FontAwesomeIcon className="icon" icon={faSnowflake} />
                  </span>
                  <span>DevHub</span>
                </span>
              </div>
              <div className="account mt-12 px-14">
                <div className="startFree">START FOR FREE</div>
                <div className="createAccount">Create new account</div>
                <div className="member mt-3">
                  <span className="memberEd">Already a member?</span>
                  <NavLink to="/login">
                    <span className="login ml-1">Login</span>
                  </NavLink>
                </div>

                <Form
                  className="mt-5 formAccount"
                  onFinish={form.handleSubmit(onSubmit)}>
                  <Form.Item>
                    <Form.Item
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                        marginRight: '16px'
                      }}
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your lastname!'
                        }
                      ]}>
                      <Input
                        placeholder="Last name"
                        allowClear
                        prefix={<UserOutlined />}
                        onChange={(e) => {
                          form.setValue('lastname', e.target.value);
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)'
                      }}
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your firstname!'
                        }
                      ]}>
                      <Input
                        placeholder="First name"
                        allowClear
                        prefix={<UserOutlined />}
                        onChange={(e) => {
                          form.setValue('firstname', e.target.value);
                        }}
                      />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    name="email"
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
                      placeholder="Email"
                      allowClear
                      prefix={<MailOutlined />}
                      onChange={(e) => {
                        form.setValue('email', e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!'
                      }
                    ]}
                    hasFeedback>
                    <Input.Password
                      placeholder="Password"
                      onChange={(e) => {
                        form.setValue('password', e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
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
                            new Error(
                              'The two passwords that you entered do not match!'
                            )
                          );
                        }
                      })
                    ]}>
                    <Input.Password
                      placeholder="Confirm Password"
                      onChange={(e) => {
                        form.setValue('confirm', e.target.value);
                      }}
                    />
                  </Form.Item>
                  <button className="buttonCreate mt-3" type="submit">
                    Create account
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default Register;
