import React, { useEffect, useState, useContext } from "react";
import {
  List,
  message,
  Avatar,
  Spin,
  Space,
  Image,
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Popconfirm,
} from "antd";
import {
  MessageOutlined,
  UploadOutlined,
  FilePdfTwoTone,
  FileExcelTwoTone,
  FileWordTwoTone,
  FilePptTwoTone,
  FileZipTwoTone,
  FileTextTwoTone,
  PlaySquareTwoTone,
  PictureTwoTone,
  LoadingOutlined,
  PaperClipOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import { convertUTC, fileType, fileName } from "../tools";
import FileViewer from "react-file-viewer";
import "./Announcement.css";
import { UserContext } from "../../AllContext";
import { ApiAnnouncement } from "../apiRequest";

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

export const Announcement = (props) => {
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

  const fetchData = (callback) => {
    ApiAnnouncement("get", (res) => callback(res.data), { page: page });
    setPage(page + 1);
  };

  const handleInfiniteOnLoad = () => {
    console.log("hello?");
    setLoading(true);
    if (status.next == null) {
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
            onClick={() => props.history.push("/announcement/add")}
          >
            + New Announcement
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
                onClick={() => props.history.push(`announcement/${item.id}`)}
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
              <div className="loading-container" style={{ width: "100%" }}>
                <Spin
                  size="large"
                  indicator={<LoadingOutlined />}
                  style={{ display: "block", margin: "auto" }}
                />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export const AnnouncementDetail = (props) => {
  const [item, setItem] = useState([]);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  const fetchData = async (callback) => {
    try {
      let response = await axios
        .get(`api/announcement/${props.match.params.id}/`)
        .then((res) => {
          callback(res);
          // console.log(res);
          return res.status;
        });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData((res) => setItem(res.data));
  }, []);

  const deletepost = async () => {
    let request = await axios.delete(
      `api/announcement/${props.match.params.id}/`
    );
    let status = await request.status;
    if (status == 204) {
      props.history.push({
        pathname: "/announcement",
        state: {
          delete_successful: true,
        },
      });
    } else {
      console.log(request);
    }
  };
  console.log(item.author);
  return item.author && !error ? (
    <List.Item className="post-con" key={item.id}>
      {item.author.id === user.pk ? (
        <div style={{ display: "flex", float: "right" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              props.history.push({
                pathname: `${item.id}/edit`,
                state: {
                  postid: item.id,
                },
              })
            }
          >
            edit
          </Button>
          <Popconfirm
            style={{ marginLeft: "10px" }}
            placement="bottomRight"
            title="Are you sure want to delete this post?"
            onConfirm={() => deletepost()}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button icon={<DeleteOutlined />} danger type="text">
              delete
            </Button>
          </Popconfirm>
        </div>
      ) : (
        <span></span>
      )}
      <List.Item.Meta
        title={<h2>{item.title}</h2>}
        description={
          item.author.username + " | " + convertUTC(item.date_posted)
        }
      />
      {item.content}
      <div style={{ width: "50%", margin: "20px" }}>
        <Upload
          listType="picture"
          defaultFileList={[
            ...item.announcefile.map((f) => {
              f.uid = f.id;
              f.name = fileName(f.file);
              f.url = f.file;
              f.status = "done";
              return f;
            }),
          ]}
          iconRender={handleIconRender}
          disabled={true}
        ></Upload>
      </div>
    </List.Item>
  ) : (
    <h3>404 Not found</h3>
  );
};

export const AnnouncementAdd = (props) => {
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onFinish = (values) => {
    console.log(values);
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("content", values.content);
    if (values.upload) {
      for (let i = 0; i < values.upload.length; i++) {
        fd.append("announcefile", values.upload[i].originFileObj);
      }
    }
    axios
      .put("api/announcement/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => props.history.push("/announcement"));
  };

  return (
    <Form
      name="nest-messages"
      onFinish={onFinish}
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

export const AnnouncementEdit = (props) => {
  // console.log(props.location.state);
  const [post, setPost] = useState(null);
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const onFinish = (values) => {
    console.log(values);
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("content", values.content);
    if (values.upload) {
      let newupload = values.upload.filter((e) => !e.id);
      let oldupload = values.upload.filter((e) => e.id);
      let deleteoldupload = post.announcefile.filter(
        (e) => !oldupload.find((f) => f.id == e.id)
      );
      for (const i in newupload) {
        fd.append("announcefile", newupload[i].originFileObj);
      }
      if (deleteoldupload.length) {
        fd.append(
          "deletefile",
          deleteoldupload.map((e) => e.id)
        );
      } else {
        fd.append("deletefile", 0);
      }
      console.log(deleteoldupload);
    } else {
      fd.append("deletefile", 0);
    }
    axios
      .put(`api/announcement/${props.match.params.id}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) =>
        props.history.push(`/announcement/${props.match.params.id}`)
      );
  };

  const loadData = async () => {
    let request = await axios.get(`api/announcement/${props.match.params.id}/`);
    let data = await request.data;
    setPost(data);
  };
  useEffect(() => {
    loadData();
  }, []);
  return post ? (
    <Form
      name="nest-messages"
      onFinish={onFinish}
      style={{ padding: "20px", minHeight: "40vh" }}
      initialValues={{
        ["title"]: post.title,
        ["content"]: post.content,
      }}
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
          defaultFileList={[
            ...post.announcefile.map((f) => {
              f.uid = f.id;
              f.name = fileName(f.file);
              f.url = f.file;
              f.status = "done";
              return f;
            }),
          ]}
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
  ) : (
    <h3>:3</h3>
  );
};
