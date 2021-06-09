import React, { useState, useEffect } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";
import axios from "axios";
import { ApiRegister, ApiCourse, ApiBatch } from "../apiRequest";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 30,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 30,
    },
    sm: {
      span: 8,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 50,
      offset: 8,
    },
    md: {
      span: 50,
      offset: 8,
    },
  },
};

export const RegisterUser = (props) => {
  useEffect(() => {}, []);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    ApiRegister(values);
  };
  return (
    <div>
      <h2>
        Register New User <UserAddOutlined style={{ fontSize: "25px" }} />
      </h2>
      <Form
        {...formItemLayout}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="Username"
          label="Username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
              whitespace: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password visibilityToggle={false} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
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
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password visibilityToggle={false} />
        </Form.Item>
        <Form.Item name="course" label="Course">
          <Select defaultValue="student">
            <Option value="student">Student</Option>
          </Select>
        </Form.Item>
        <Form.Item name="batch" label="Batch">
          <Select defaultValue="student">
            <Option value="student">Student</Option>
          </Select>
        </Form.Item>
        <Form.Item name="identity" label="Identity">
          <Select defaultValue="student">
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
