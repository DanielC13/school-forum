import React, { useState, useEffect, useContext } from "react";
import {
  List,
  message,
  Spin,
  Space,
  Button,
  Form,
  Input,
  Upload,
  Popconfirm,
  Card,
} from "antd";
import {
  LoadingOutlined,
  UploadOutlined,
  FilePdfTwoTone,
  FileExcelTwoTone,
  FileWordTwoTone,
  FilePptTwoTone,
  FileZipTwoTone,
  FileTextTwoTone,
  PlaySquareTwoTone,
  PictureTwoTone,
  PaperClipOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./Course.css";
import Loading from "../Loading";
import axios from "axios";
import { UserContext } from "../../UserContext";
import InfiniteScroll from "react-infinite-scroller";
import { convertUTC, fileType, fileName } from "../tools";

const { Meta } = Card;

const handleIconRender = (file, listType) => {
  const fileSufIconList = [
    { type: <FilePdfTwoTone />, suf: [".pdf"] },
    { type: <FileExcelTwoTone />, suf: [".xlsx", ".xls", ".csv"] },
    { type: <FileWordTwoTone />, suf: [".doc", ".docx"] },
    { type: <FilePptTwoTone />, suf: [".pptx", ".ppt", "pptm"] },
    { type: <FileZipTwoTone />, suf: [".zip"] },
    { type: <FileTextTwoTone />, suf: [".txt"] },
    { type: <PlaySquareTwoTone />, suf: [".mp4"] },
    {
      type: <PictureTwoTone />,
      suf: [
        ".webp",
        ".svg",
        ".png",
        ".gif",
        ".jpg",
        ".jpeg",
        ".jfif",
        ".bmp",
        ".dpg",
      ],
    },
  ];
  // console.log(1, file, listType);
  let icon =
    file.status === "uploading" ? <LoadingOutlined /> : <PaperClipOutlined />;
  if (listType === "picture" || listType === "picture-card") {
    if (listType === "picture-card" && file.status === "uploading") {
      icon = <LoadingOutlined />; // or icon = 'uploading...';
    } else {
      fileSufIconList.forEach((item) => {
        if (item.suf.includes(file.name.substr(file.name.lastIndexOf(".")))) {
          icon = item.type;
        }
      });
    }
  }
  return icon;
};

export const Course = (props) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchData((res) => setData(res.data));
  }, []);
  const fetchData = async (callback) => {
    let request = await axios.get("api/course/");
    if (request.status == 200) {
      callback(request);
      // console.log(request.data.results);
      return;
    }
    setError(request.status);
  };
  console.log(data, error);
  return data ? (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {data.results.map((course) => (
        <Card
          style={{ width: 200, margin: "10px" }}
          hoverable={true}
          onClick={() =>
            props.history.push({
              pathname: `course/${course.name}`,
              state: {
                course: course,
              },
            })
          }
        >
          <Meta title={course.name} description="This is the description" />
        </Card>
      ))}
    </div>
  ) : (
    <Loading />
  );
};

export const CoursePost = (props) => {
  // console.log(props.location.state);
  const [status, setStatus] = useState({});
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasmore] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData((res) => {
      setStatus(res);
      setData(res.results);
    });
  }, []);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const fetchData = async (callback) => {
    // console.log(axios.defaults.headers.common);
    let course = await axios.get("api/course/").then((e) => e.data.results);
    console.log(course);
    axios
      .get(`api/course/${props.location.state.course.id}/posts/?page=${page}`)
      .then((res) => callback(res.data));
    setPage(page + 1);
  };

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    if (status.next == null) {
      // message.warning("Infinite List loaded all");
      setHasmore(false);
      setLoading(false);
      return;
    }
    fetchData((res) => {
      let newdata = data.concat(res.results);
      // cannot do page++
      setStatus(res);
      setData(newdata);
      setLoading(false);
    });
  };
  // console.log(page);
  return (
    <div>
      <div
        style={{
          float: "right",
          position: "relative",
          top: "-100px",
        }}
      >
        {user.is_staff ? (
          <Button
            type="primary"
            onClick={() =>
              props.history.push(
                `/course/${props.location.state.course.name}/add`
              )
            }
          >
            + New Course Post
          </Button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          // useWindow={false}
        >
          <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                className="post-con"
                key={item.id}
                onClick={() => props.history.push(`course/${item.id}`)}
              >
                <List.Item.Meta
                  title={<h4>{item.title}</h4>}
                  description={item.author.username}
                />
                {convertUTC(item.date_posted)}
              </List.Item>
            )}
          >
            {loading && hasMore && (
              <div className="demo-loading-container">
                <Spin indicator={<LoadingOutlined />} />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export const CoursePostAdd = (props) => {
  const { user } = useContext(UserContext);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onFinish = (values) => {
    console.log(values);
    console.log(user);
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("content", values.content);
    if (values.upload) {
      for (let i = 0; i < values.upload.length; i++) {
        fd.append("announcefile", values.upload[i].originFileObj);
      }
    }
    axios
      .put("api/course/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => props.history.push("/announcement"));
  };

  return (
    <Form
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
      style={{ padding: "20px", minHeight: "40vh" }}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="Content" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="upload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="logo"
          customRequest={dummyRequest}
          listType="picture"
          iconRender={handleIconRender}
          style={{ maxWidth: "300px" }}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item style={{ float: "right" }}>
        <Button type="primary" htmlType="submit" size="large">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};