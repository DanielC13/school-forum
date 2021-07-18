import { Alert, Form, Input, Button, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Login.css";
import randomimg from "../img/random.jpg";
import { useCookies } from "react-cookie";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [error, seterror] = useState(null);
  const onFinish = async (values) => {
    let opt = { path: "/" };
    try {
      let i = await axios.post(
        "dj-rest-auth/login/",
        {
          username: values.username,
          password: values.password,
        },
        { headers: { Authorization: "" } }
      );
      setCookie("tkn", i.data.access_token, opt);
      window.location.reload();
    } catch (error) {
      seterror(error);
    }
  };
  return (
    <div className="con">
      <div className="inner-con">
        <div className="form-container">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <h1>Login</h1>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              {error ? (
                <Alert
                  message="Wrong username or password"
                  type="error"
                  showIcon
                  style={{ fontSize: "12px" }}
                />
              ) : (
                <span></span>
              )}
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="password-reset">
                Forgot password
              </a>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
        <img
          className="picture-container"
          src={randomimg}
          alt=""
          width="100"
          height="100"
        />
      </div>
    </div>
  );
};

export const PasswordResetForm = () => {
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const onFinish = async (value) => {
    try {
      setloading(true);
      let i = await axios
        .post("dj-rest-auth/password/reset/", {
          email: value.email,
        })
        .then((res) => setloading(false));
      seterror(false);
    } catch (error) {
      seterror(error);
    }
  };
  return (
    <div className="con">
      <div className="inner-con">
        <div className="form-container reset-form">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <h1>Forgot password</h1>
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "The input is not valid E-mail!" },
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            {error ? (
              <Alert
                message="Something went wrong...Please try again."
                type="error"
                showIcon
                closable
                style={{ fontSize: "12px" }}
              />
            ) : error == null ? (
              <span></span>
            ) : (
              <Alert
                message="Password Reset Link has been sended,check your mail"
                type="success"
                showIcon
                style={{ fontSize: "12px" }}
              />
            )}
            <p>Reset Password link will be send to your email</p>
            <Form.Item>
              <Button type="primary" loading={loading} htmlType="submit">
                Send Email
              </Button>
            </Form.Item>
          </Form>
        </div>
        <img
          className="picture-container"
          src={randomimg}
          alt=""
          width="100"
          height="100"
        />
      </div>
    </div>
  );
};

export const PasswordResetConfirm = (props) => {
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);

  const onFinish = async (value) => {
    try {
      setloading(true);
      let i = await axios
        .post("dj-rest-auth/password/reset/confirm/", {
          new_password1: value.new_password1,
          new_password2: value.new_password2,
          uid: props.match.params.uid,
          token: props.match.params.token,
        })
        .then((res) => setloading(false));
      seterror(false);
    } catch (error) {
      seterror(error);
    }
  };
  return (
    <div className="con">
      <div className="inner-con">
        <div className="form-container">
          {error || error == null ? (
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <h1>Reset password</h1>
              <Form.Item
                name="new_password1"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  {
                    validator: (_, password) => {
                      if (password.length < 8 && password.length > 0) {
                        return Promise.reject(
                          new Error("Password cannot less than 8 letters")
                        );
                      } else if (password.length >= 8) {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<KeyOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="New password"
                />
              </Form.Item>
              <Form.Item
                name="new_password2"
                rules={[
                  {
                    required: true,
                    message: "Please input your confirm password!",
                  },
                  ({ getFieldValue }) => ({
                    validator: (_, password) => {
                      if (getFieldValue("new_password1") !== password) {
                        return Promise.reject(
                          new Error(
                            "New password and confirm password must be the same!"
                          )
                        );
                      } else if (
                        getFieldValue("new_password1") == password &&
                        password.length >= 8
                      ) {
                        return Promise.resolve();
                      } else if (password.length < 8 && password.length > 0) {
                        return Promise.reject(
                          new Error("Password cannot less than 8 letters")
                        );
                      }
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input
                  prefix={<KeyOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Confirm password"
                />
              </Form.Item>
              {error ? (
                <Alert
                  message="Something went wrong...Please try again."
                  type="error"
                  showIcon
                  style={{ fontSize: "12px" }}
                />
              ) : error == null ? (
                <span></span>
              ) : (
                <Alert
                  message="Password Reset Complete!"
                  type="success"
                  showIcon
                  style={{ fontSize: "12px" }}
                />
              )}
              <Form.Item>
                <Button type="primary" loading={loading} htmlType="submit">
                  Reset
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Alert
                message="Reset password success!"
                type="success"
                showIcon
                style={{ fontSize: "15px" }}
              />
              <p style={{ float: "right", fontSize: "15px" }}>
                Return to{" "}
                <Link to="/login" replace>
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
        <img
          className="picture-container"
          src={randomimg}
          alt=""
          width="100"
          height="100"
        />
      </div>
    </div>
  );
};
