import React, { useState, useEffect, useContext } from "react";
import { message, List, Form, Input, Upload, Button, Spin } from "antd";
import { CourseContext, UserContext } from "../../AllContext";
import { convertUTC } from "../tools";
import { ApiBatch } from "../apiRequest";
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
  SaveTwoTone,
} from "@ant-design/icons";
import axios from "axios";

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

export const BatchPost = (props) => {
  const [data, setData] = useState({ next: null });
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  useEffect(() => {
    if (!findcourse) {
      message.error(`"${props.match.params.course}" Course was not found!`);
      return props.history.push("/course");
    } else if (
      user.detail.batch !== props.match.params.batch &&
      !user.is_staff
    ) {
      message.warn(`Access denied, You're not belong to this batch!`);
      return props.history.push(`/course/${props.match.params.course}`);
    }

    fetchData((res) => {
      setPosts(res.results);
      setData(res);
    });
  }, []);

  useEffect(() => {
    console.log("here?");
    document.addEventListener("scroll", trackScroll);
  }, [data.next]);

  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= window.outerHeight;
  };
  const trackScroll = async () => {
    const wrappedElement = document.getElementById("footer");
    if (isBottom(wrappedElement)) {
      // console.log("bottom reached!");
      document.removeEventListener("scroll", trackScroll);
      if (data) {
        let { next = null } = data;
        if (next == null) return console.log("no data!");
        setLoading(true);
        await axios
          .get(next)
          .then((res) => {
            let morePost = posts.concat(res.data.results);
            setPosts(morePost);
            setData(res.data);
            // console.log(morePost);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error.response);
            document.removeEventListener("scroll", trackScroll);
          });
      }
    }
  };

  const fetchData = async (callback) => {
    await ApiBatch(
      "get",
      (res) => {
        if (res.status == 200) {
          callback(res.data);
        } else {
          console.log(res);
        }
      },
      {
        type: "posts",
        courseId: findcourse.id,
        batchId: props.match.params.batch,
      }
    );
  };

  return posts ? (
    <div>
      <div
        style={{
          float: "right",
          position: "relative",
          top: "-100px",
        }}
      >
        {user.is_staff || user.detail.batch == props.match.params.batch ? (
          <Button
            type="primary"
            onClick={() =>
              props.history.push(`${props.match.params.batch}/add`)
            }
          >
            + New Batch Post
          </Button>
        ) : (
          <span></span>
        )}
      </div>
      <div>
        {posts.map((post) => (
          <List.Item
            className="post-con"
            key={post.id}
            // onClick={() =>
            //   props.history.push(`${props.match.params.course}/${item.id}`)
            // }
          >
            <List.Item.Meta
              title={<h4>{post.title}</h4>}
              description={post.author.username}
            />
            {convertUTC(post.date_posted)}
          </List.Item>
        ))}
        {loading ? (
          <div className="loading-container" style={{ width: "100%" }}>
            <Spin
              size="large"
              indicator={<LoadingOutlined />}
              style={{ display: "block", margin: "auto" }}
            />
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  ) : (
    <p>loading ...</p>
  );
};

export const BatchPostAdd = (props) => {
  const { user } = useContext(UserContext);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  useEffect(() => {
    if (!findcourse) {
      message.error(`"${props.match.params.course}" Course was not found!`);
      return props.history.push("/course");
    } else if (
      user.detail.batch !== props.match.params.batch &&
      !user.is_staff
    ) {
      message.warn(`Access denied, You're not belong to this batch!`);
      return props.history.push(`/course/${props.match.params.course}`);
    }
  }, []);

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
        fd.append("batchfile", values.upload[i].originFileObj);
      }
    }
    ApiBatch(
      "post",
      (res) => {
        if (res.status == 400) {
          for (const key in res.data) {
            if (Object.hasOwnProperty.call(res.data, key)) {
              message.error(res.data[key]);
            }
          }
        } else if (res.status == 200) {
          message.success("Post has been created!");
          props.history.goBack();
        } else {
          console.log(res);
        }
      },
      {
        courseId: findcourse.id,
        batchId: props.match.params.batch,
        formdata: fd,
      }
    );
  };

  return (
    <div>
      <h2>New Batch Post</h2>
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
    </div>
  );
};

