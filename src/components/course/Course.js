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
  Modal,
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
  SaveTwoTone,
} from "@ant-design/icons";
import "./Course.css";
import Loading from "../Loading";
import axios from "axios";
import { UserContext, CourseContext } from "../../AllContext";
import InfiniteScroll from "react-infinite-scroller";
import { convertUTC, fileType, fileName } from "../tools";
import { ApiCourse } from "../apiRequest";

const { Meta } = Card;
const { confirm: cusConfirm } = Modal;

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
  // console.log(data, error);
  return data ? (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {data.map((course) => (
        <Card
          style={{ width: 200, margin: "10px" }}
          hoverable={true}
          onClick={() =>
            props.history.push({
              pathname: `course/${course.name}`,
              // state: {
              //   course: course,
              // },
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
  const [batch, setBatch] = useState([]);
  const { user } = useContext(UserContext);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  useEffect(() => {
    if (!findcourse) {
      message.error(`"${props.match.params.course}" Course was not found!`);
      return props.history.push("/course");
    }
    fetchData((res) => {
      setStatus(res);
      setData(res.results);
    });
    fetchBatch((res) => setBatch(res.data));
  }, []);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const fetchData = (callback) => {
    ApiCourse(
      "get",
      (res) => (res.status == 200 ? callback(res.data) : console.log(res)),
      {
        type: "posts",
        courseId: findcourse.id,
        page: page,
      }
    );
    setPage(page + 1);
  };

  const fetchBatch = (callback) => {
    ApiCourse("get", (res) => callback(res), {
      type: "batch",
      courseId: findcourse.id,
    });
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

  return (
    <div>
      <div
        style={{
          float: "right",
          position: "relative",
          top: "-80px",
        }}
      >
        {user.is_staff || user.identity == "teacher" ? (
          <Button
            type="primary"
            onClick={() =>
              props.history.push(`/course/${props.match.params.course}/add`)
            }
          >
            + New Course Post
          </Button>
        ) : (
          <span></span>
        )}
      </div>
      <div>
        <h2>Batches</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {batch.map((e) => (
            <Card style={{ width: 200, margin: "10px" }} hoverable={true}>
              <Meta
                title={e.name}
                description={`level ${e.level}`}
                onClick={() =>
                  props.history.push(
                    `${props.match.params.course}/batch/${e.id}`
                  )
                }
              />
            </Card>
          ))}
        </div>
      </div>
      <div className="demo-infinite-container">
        <h2>{props.match.params.course} Posts</h2>
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
                onClick={() =>
                  props.history.push(`${props.match.params.course}/${item.id}`)
                }
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
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  useEffect(() => {
    if (!findcourse) {
      message.error(`"${props.match.params.course}" Course was not found!`);
      return props.history.push("/course");
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
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("content", values.content);
    if (values.upload) {
      for (let i = 0; i < values.upload.length; i++) {
        fd.append("coursefile", values.upload[i].originFileObj);
      }
    }
    ApiCourse(
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
          props.history.push(`/course/${props.match.params.course}`);
        } else {
          console.log(res);
        }
      },
      { courseId: findcourse.id, formdata: fd }
    );
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

export const CoursePostDetail = (props) => {
  const [item, setItem] = useState([]);
  const { user } = useContext(UserContext);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  const fetchData = (callback) => {
    ApiCourse(
      "retrieve",
      (res) => {
        if (res.status == 200) {
          callback(res);
        } else if (res.status == 404) {
          message.error("Post Not Found!");
          props.history.push(`/course/${props.match.params.course}`);
        } else {
          message.error(res.data.detail);
        }
      },
      {
        courseId: findcourse.id,
        id: props.match.params.id,
      }
    );
  };
  useEffect(() => {
    if (!findcourse) {
      message.error(`"${props.match.params.course}" Course was not found!`);
      return props.history.push("/course");
    }
    fetchData((res) => setItem(res.data));
  }, []);

  const deletepost = () => {
    ApiCourse(
      "delete",
      (res) => {
        if (res.status == 204) {
          message.success("post has been deleted");
          props.history.push(`/course/${props.match.params.course}`);
        } else {
          console.log(res);
        }
      },
      {
        courseId: findcourse.id,
        id: props.match.params.id,
      }
    );
  };

  return item.author ? (
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
            onConfirm={deletepost}
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
            ...item.coursefile.map((f) => {
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
    <h3>Something went wrong...</h3>
  );
};

export const CoursePostEdit = (props) => {
  const [post, setPost] = useState(null);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

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
    cusConfirm({
      title: "Update this post",
      icon: <SaveTwoTone />,
      content: "Do you sure want to update these changes?",
      okText: "Update",
      okType: "primary",
      cancelText: "Cancel",
      async onOk() {
        console.log(values);
        const fd = new FormData();
        fd.append("title", values.title);
        fd.append("content", values.content);
        if (values.upload) {
          let newupload = values.upload.filter((e) => !e.id);
          let oldupload = values.upload.filter((e) => e.id);
          let deleteoldupload = post.coursefile.filter(
            (e) => !oldupload.find((f) => f.id == e.id)
          );
          for (const i in newupload) {
            fd.append("coursefile", newupload[i].originFileObj);
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
        ApiCourse(
          "put",
          (res) => {
            if (res.status == 200) {
              message.success("post updated!");
              props.history.push(
                `/course/${props.match.params.course}/${props.match.params.id}`
              );
            } else {
              console.log(res);
            }
          },
          {
            courseId: findcourse.id,
            id: props.match.params.id,
            formdata: fd,
          }
        );
      },
    });
  };

  const loadData = async () => {
    ApiCourse(
      "retrieve",
      (res) => {
        if (res.status == 200) {
          setPost(res.data);
        } else if (res.status == 404) {
          message.error("Post Not Found!");
          props.history.push(`/course/${props.match.params.course}`);
        } else {
          message.error(res.data.detail);
        }
      },
      {
        courseId: findcourse.id,
        id: props.match.params.id,
      }
    );
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
            ...post.coursefile.map((f) => {
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
