import React, { useState, useEffect, useContext } from "react";
import {
  message,
  List,
  Form,
  Input,
  Upload,
  Button,
  Spin,
  Popconfirm,
  Modal,
} from "antd";
import { CourseContext, UserContext } from "../../AllContext";
import { convertUTC, fileName, fileType, handleIconRender } from "../tools";
import { ApiBatch } from "../apiRequest";
import {
  LoadingOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SaveTwoTone,
} from "@ant-design/icons";
import axios from "axios";

const { confirm: cusConfirm } = Modal;

export const BatchPost = (props) => {
  const [data, setData] = useState({ next: null });
  const [posts, setPosts] = useState(null);
  const [batch, setBatch] = useState(null);
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
    fetchBatch((res) => setBatch(res));
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
        if (!res) {
          message.error("Something Went Wrong");
          return props.history.goBack();
        }
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

  const fetchBatch = async (callback) => {
    await ApiBatch(
      "get",
      (res) => {
        if (!res) {
          message.error("Something Went Wrong");
          return props.history.goBack();
        }
        if (res.status == 200) {
          callback(res.data);
        } else {
          console.log(res);
        }
      },
      {
        type: "detail",
        courseId: findcourse.id,
        batchId: props.match.params.batch,
      }
    );
  };

  return posts && batch ? (
    <div>
      <div
        style={{
          float: "right",
          position: "relative",
          top: "-80px",
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
        <h2>
          {batch.name} Posts ({props.match.params.course} level {batch.level})
        </h2>
        {posts.map((post) => (
          <List.Item
            className="post-con"
            key={post.id}
            onClick={() =>
              props.history.push(`${props.match.params.batch}/${post.id}`)
            }
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

export const BatchPostDetail = (props) => {
  const [item, setItem] = useState([]);
  const { user } = useContext(UserContext);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  const fetchData = (callback) => {
    ApiBatch(
      "retrieve",
      (res) => {
        if (res.status == 200) {
          callback(res);
        } else if (res.status == 404) {
          message.error("Post Not Found!");
          props.history.goBack();
        } else {
          message.error(res.data.detail);
        }
      },
      {
        courseId: findcourse.id,
        batchId: props.match.params.batch,
        id: props.match.params.id,
      }
    );
  };

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
    fetchData((res) => setItem(res.data));
  }, []);

  const deletepost = () => {
    ApiBatch(
      "delete",
      (res) => {
        if (res.status == 204) {
          message.success("post has been deleted");
          props.history.goBack();
        } else {
          console.log(res);
        }
      },
      {
        courseId: findcourse.id,
        batchId: props.match.params.batch,
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
            ...item.batchfile.map((f) => {
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

export const BatchPostEdit = (props) => {
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
          let deleteoldupload = post.batchfile.filter(
            (e) => !oldupload.find((f) => f.id == e.id)
          );
          for (const i in newupload) {
            fd.append("batchfile", newupload[i].originFileObj);
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
        console.log("modcheck?", fd);
        ApiBatch(
          "put",
          (res) => {
            if (res.status == 200) {
              message.success("post updated!");
              props.history.goBack();
            } else {
              console.log(res);
            }
          },
          {
            courseId: findcourse.id,
            batchId: props.match.params.batch,
            id: props.match.params.id,
            formdata: fd,
          }
        );
      },
    });
  };

  const loadData = async () => {
    ApiBatch(
      "retrieve",
      (res) => {
        if (res.status == 200) {
          setPost(res.data);
        } else if (res.status == 404) {
          message.error("Post Not Found!");
          props.history.goBack();
        } else {
          message.error(res.data.detail);
        }
      },
      {
        courseId: findcourse.id,
        batchId: props.match.params.batch,
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
            ...post.batchfile.map((f) => {
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
