import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import { ConfigProvider, Form, Input } from "antd";
import { useDispatch } from "react-redux";

import StyleTotal from "./cssSignUp";
import { REGIS_USER_SAGA } from "@/redux/actionSaga/UserActionSaga";
import { useTheme } from "@/components/theme-provider";

const SignUpPage = () => {
  const dispatch = useDispatch();

  const { getTheme } = useTheme();

  const { themeColorSet } = getTheme();

  const onSubmit = (data: any) => {
    console.log(data);
    dispatch(
      REGIS_USER_SAGA({
        userRegister: data,
      })
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: themeColorSet.colorText2,
          colorBgBase: themeColorSet.colorBg2,
          lineWidth: 0,
          controlHeight: 40,
        },
      }}>
      <StyleTotal className="w-screen h-screen" theme={themeColorSet}>
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
                  <NavLink to="/sign-in">
                    <span className="login ml-1">Login</span>
                  </NavLink>
                </div>

                <Form className="mt-5 formAccount" onFinish={onSubmit}>
                  <Form.Item>
                    <Form.Item
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                        marginRight: "16px",
                      }}
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: "Please input your lastname!",
                        },
                      ]}>
                      <Input placeholder="Last name" allowClear />
                    </Form.Item>
                    <Form.Item
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                      }}
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: "Please input your firstname!",
                        },
                      ]}>
                      <Input placeholder="First name" allowClear />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                    ]}>
                    <Input placeholder="Email" allowClear />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters!",
                      },
                    ]}
                    hasFeedback>
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}>
                    <Input.Password placeholder="Confirm Password" />
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

export default SignUpPage;
