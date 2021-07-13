import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import {
  UserAddOutlined,
  EditOutlined,
  SearchOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  SaveTwoTone,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  message,
  Checkbox,
  Modal,
} from "antd";
import { ApiUsers, ApiCourse, testrequest } from "../apiRequest";
import { CourseContext } from "../../AllContext";
import "./Users.css";
import axios from "axios";

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

export const UserList = (props) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [searchedCol, setSearchedCol] = useState("");
  const [data, setData] = useState([]);
  const allcourse = useContext(CourseContext);
  let searchInput = null;
  let iconStyle = {
    fontSize: "30px",
    width: "100px",
    color: "rgba(0, 0, 0, 0.45)",
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex == "detail.batch" && record.detail) {
        return record.detail.batch.name
          ? record.detail.batch.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "";
      }
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedCol === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchTxt]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTxt(selectedKeys[0]);
    setSearchedCol(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchTxt("");
  };

  const sortAlphabet = (a, b) => {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "20%",
      ...getColumnSearchProps("username"),
      sorter: (a, b) => sortAlphabet(a.username, b.username),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => sortAlphabet(a.email, b.email),
    },
    {
      title: "Identity",
      dataIndex: "identity",
      key: "identity",
      filters: [
        {
          text: "Student",
          value: "student",
        },
        {
          text: "Teacher",
          value: "teacher",
        },
        {
          text: "Admin",
          value: "admin",
        },
      ],
      align: "center",
      onFilter: (value, record) => record.identity == value,
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      filters: allcourse.reduce(
        (arry, obj) => arry.concat({ text: obj.name, value: obj.id }),
        []
      ),
      onFilter: (value, record) => record.course == value,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.detail) return record.detail.course.name;
        return "None";
      },
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
      ...getColumnSearchProps("detail.batch"),
      render: (text, record) => {
        if (record.detail) return record.detail.batch.name;
        return "None";
      },
    },
    {
      title: "Action",
      key: "action",
      width: "5%",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/users/${record.id}`}>action</Link>
        </Space>
      ),
    },
  ];

  const fetchData = (callback) => {
    ApiUsers("get", (res) => callback(res), {});
  };

  useEffect(() => {
    fetchData((res) => setData(res.data));
  }, []);
  return (
    <div>
      <div className="card">
        <Link to="/users/register">
          <UserAddOutlined className="icon" style={iconStyle} />
          <div className="con-title">
            <span>Register New User</span>
          </div>
        </Link>
      </div>
      <div className="user-list">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export const RegisterUser = (props) => {
  const allcourse = useContext(CourseContext);
  const [batch, setBatch] = useState([]);
  const [defaultbatch, setDefaultbatch] = useState("None");

  const onFinish = async (values) => {
    values.batch = defaultbatch;
    console.log("Received values of form: ", values);
    let request = await ApiUsers("post", (res) => res, {
      formdata: values,
    });
    if (request.status == 400) {
      for (const key in request.data) {
        if (Object.hasOwnProperty.call(request.data, key)) {
          message.error(request.data[key]);
        }
      }
    } else if (request.status == 201) {
      message.success("User created");
      props.history.push("/users");
    }
  };

  const handleCourseChange = (value) => {
    ApiCourse(
      "get",
      (res) => {
        if (res.data instanceof Array) {
          if (res.data.length !== 0) {
            setDefaultbatch(res.data[0].id);
          } else {
            setDefaultbatch("None");
          }
          return setBatch(res.data);
        }
        setDefaultbatch("None");
        return setBatch([]);
      },
      {
        type: "batch",
        courseId: value,
      }
    );
  };

  const onBatchChange = (value) => {
    setDefaultbatch(value);
    console.log(value);
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
          name="username"
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
          <Select defaultValue="None" onChange={handleCourseChange}>
            {allcourse.map((c) => (
              <Option value={c.id}>{c.name}</Option>
            ))}
            <Option value="None">None</Option>
          </Select>
        </Form.Item>
        <Form.Item name="batch" label="Batch">
          {/* weird bug I have to put this defaultbatch */}
          <span style={{ display: "none" }}>{defaultbatch}</span>
          <Select value={defaultbatch} onChange={onBatchChange}>
            {batch.length !== 0
              ? batch.map((b) => (
                  <Option key={b} value={b.id}>
                    {b.name}
                  </Option>
                ))
              : console.log("No batch found")}
          </Select>
        </Form.Item>
        <Form.Item
          name="identity"
          label="Identity"
          rules={[{ required: true, message: "Please select an Identity!" }]}
        >
          <Select defaultValue="">
            <Option value="">-- Please Select One --</Option>
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
            <Option value="admin">Admin</Option>
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

export const EditUser = (props) => {
  const allcourse = useContext(CourseContext);
  const [batch, setBatch] = useState([]);
  const [defaultbatch, setDefaultbatch] = useState("None");
  const [userInfo, setUserInfo] = useState(null);
  const [checkDel, setCheckDel] = useState(true);
  const { confirm } = Modal;
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    await ApiUsers(
      "retrieve",
      (res) => {
        if (res.status == 200) {
          setUserInfo(res.data);
          ApiCourse(
            "get",
            (res2) => {
              if (res2.data instanceof Array) {
                if (res2.data.length !== 0) {
                  setDefaultbatch(res.data.batch);
                } else {
                  setDefaultbatch("None");
                }
                return setBatch(res2.data);
              }
              setDefaultbatch("None");
              return setBatch([]);
            },
            {
              type: "batch",
              courseId: res.data.course,
            }
          );
        } else {
          props.history.push("/users");
        }
      },
      {
        id: props.match.params.id,
      }
    );
  };

  const onFinish = (values) => {
    values.batch = defaultbatch;
    // console.log("Received values of form: ", values);
    confirm({
      title: "Save Changes",
      icon: <SaveTwoTone />,
      content: "Do you sure want to save the changes?",
      okText: "Save",
      okType: "primary",
      cancelText: "Cancel",
      async onOk() {
        await ApiUsers(
          "patch",
          (res) => {
            console.log(res);
            if (res.status == 400) {
              for (const key in res.data) {
                if (Object.hasOwnProperty.call(res.data, key)) {
                  message.error(res.data[key]);
                }
              }
            } else if (res.status == 200) {
              console.log("success");
              props.history.push("/users");
            }
          },
          {
            id: props.match.params.id,
            formdata: values,
          }
        );
      },
    });
  };

  const handleCourseChange = (value) => {
    ApiCourse(
      "get",
      (res) => {
        if (res.data instanceof Array) {
          if (res.data.length !== 0) {
            setDefaultbatch(res.data[0].id);
          } else {
            setDefaultbatch("None");
          }
          return setBatch(res.data);
        }
        setDefaultbatch("None");
        return setBatch([]);
      },
      {
        type: "batch",
        courseId: value,
      }
    );
  };

  const onBatchChange = (value) => {
    setDefaultbatch(value);
    console.log(value);
  };

  const checkDelete = (e) => {
    if (e.target.checked) return setCheckDel(false);
    return setCheckDel(true);
  };

  const confirmDel = () => {
    confirm({
      title: "Delete this user",
      icon: <ExclamationCircleTwoTone twoToneColor="#D1D621" />,
      content:
        "Warning: All of the post will be delete when the user has been deleted, the data can't be recover.",
      okText: "Confirm",
      okType: "primary",
      okButtonProps: {
        danger: true,
        style: { backgroundColor: "red" },
      },
      cancelText: "Cancel",
      async onOk() {
        console.log("deleted");
        await ApiUsers(
          "delete",
          (res) => {
            if (res.status == 204) {
              message.success("user has been deleted");
              props.history.push("/users");
            }
          },
          {
            id: props.match.params.id,
          }
        );
      },
    });
  };
  return userInfo ? (
    <div>
      <h2>
        Edit User Information <EditOutlined style={{ fontSize: "25px" }} />
      </h2>
      <Form
        {...formItemLayout}
        name="register"
        onFinish={onFinish}
        initialValues={userInfo}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
              whitespace: false,
            },
          ]}
        >
          <Input disabled />
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
        <Form.Item name="course" label="Course">
          <Select onChange={handleCourseChange}>
            {allcourse.map((c) => (
              <Option value={c.id}>{c.name}</Option>
            ))}
            <Option value="None">None</Option>
          </Select>
        </Form.Item>
        <Form.Item name="batch" label="Batch">
          {/* weird bug I have to put this defaultbatch */}
          <span style={{ display: "none" }}>{defaultbatch}</span>
          <Select value={defaultbatch} onChange={onBatchChange}>
            {batch.length !== 0
              ? batch.map((b) => (
                  <Option key={b} value={b.id}>
                    {b.name}
                  </Option>
                ))
              : console.log("No batch found")}
          </Select>
        </Form.Item>
        <Form.Item
          name="identity"
          label="Identity"
          rules={[{ required: true, message: "Please select an Identity!" }]}
          style={{ marginBottom: "5px" }}
        >
          <Select defaultValue="">
            <Option value="">-- Please Select One --</Option>
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item
          {...tailFormItemLayout}
          className="input-checkbox"
          style={{ marginBottom: "5px" }}
        >
          <Checkbox
            style={{ color: "red", fontSize: "13px" }}
            onChange={checkDelete}
          >
            I confirm want to DELETE this user
          </Checkbox>
        </Form.Item>
        <Form.Item
          {...tailFormItemLayout}
          style={{ width: "66.5%", textAlign: "right" }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "5px" }}
          >
            Save
          </Button>
          <Button
            className="btn-delete"
            htmlType="button"
            onClick={confirmDel}
            danger
            disabled={checkDel}
          >
            Delete
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <p>loading</p>
  );
};
