import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../AllContext";
import {
  Card,
  Empty,
  Button,
  List,
  Spin,
  Space,
  message,
  Form,
  Input,
  Upload,
  Popconfirm,
  Modal,
} from "antd";
import {
  LoadingOutlined,
  UploadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  SaveTwoTone,
} from "@ant-design/icons";
import Loading from "../Loading";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import { convertUTC, fileType, fileName, handleIconRender } from "../tools";
import { ApiGroup } from "../apiRequest";
const { Meta } = Card;
const { confirm: cusConfirm } = Modal;

export const Group = (props) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      {user.is_members.length ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {user.is_members.map((group) => (
            <Card
              key={group.id}
              style={{ width: 200, margin: "10px" }}
              hoverable={true}
              onClick={() => {
                props.history.push(`group/${group.id}`);
              }}
            >
              <Meta
                title={group.name}
                description={`created by ${group.created_by.username}`}
              />
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          imageStyle={{
            height: 80,
          }}
          description={<span>You haven't join any group yet</span>}
        >
          <Button type="primary">Join Now</Button>
        </Empty>
      )}
    </div>
  );
};

export const GroupPost = (props) => {
  const [data, setData] = useState({ next: null });
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (
      !user.is_members
        .map((e) => e.id)
        .includes(parseInt(props.match.params.group))
    ) {
      message.warn(`Access denied, You're not the member of this group!`);
      return props.history.push(`/group`);
    }
    fetchData((res) => {
      // posts have to generate before data
      setPosts(res.results);
      setData(res);
    }, true);
  }, []);

  useEffect(() => {
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
            console.log(error);
            console.log(error.response);
            document.removeEventListener("scroll", trackScroll);
          });
      }
    }
  };

  const fetchData = async (callback) => {
    await ApiGroup(
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
      { type: "posts", groupId: props.match.params.group }
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
        {user.is_staff ? (
          <Button
            type="primary"
            onClick={() =>
              props.history.push(`${props.match.params.group}/add`)
            }
          >
            + New Group Post
          </Button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="demo-infinite-container">
        {posts.map((post) => (
          <List.Item
            className="post-con"
            key={post.id}
            onClick={() =>
              props.history.push(`${props.match.params.group}/${post.id}`)
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

export const GroupPostAdd = (props) => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (
      !user.is_members
        .map((e) => e.id)
        .includes(parseInt(props.match.params.group))
    ) {
      message.warn(`Access denied, You're not the member of this group!`);
      return props.history.push(`/group`);
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
        fd.append("groupfile", values.upload[i].originFileObj);
      }
    }
    ApiGroup(
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
        groupId: props.match.params.group,
        formdata: fd,
      }
    );
  };

  return (
    <div>
      <h2>New Group Post</h2>
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

export const GroupPostDetail = (props) => {
  const [item, setItem] = useState([]);
  const { user } = useContext(UserContext);
  const fetchData = (callback) => {
    ApiGroup(
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
        groupId: props.match.params.group,
        id: props.match.params.id,
      }
    );
  };

  useEffect(() => {
    if (
      !user.is_members
        .map((e) => e.id)
        .includes(parseInt(props.match.params.group))
    ) {
      console.log(
        user.is_members.map((e) => e.id),
        props.match.params,
        user.is_members.map((e) => e.id).includes(parseInt(props.match.params))
      );
      message.warn(`Access denied, You're not the member of this group!`);
      return props.history.push(`/group`);
    }
    fetchData((res) => setItem(res.data));
  }, []);

  const deletepost = () => {
    ApiGroup(
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
        groupId: props.match.params.group,
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
            ...item.groupfile.map((f) => {
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

export const GroupPostEdit = (props) => {
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
          let deleteoldupload = post.groupfile.filter(
            (e) => !oldupload.find((f) => f.id == e.id)
          );
          for (const i in newupload) {
            fd.append("groupfile", newupload[i].originFileObj);
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
        ApiGroup(
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
            groupId: props.match.params.group,
            id: props.match.params.id,
            formdata: fd,
          }
        );
      },
    });
  };

  const loadData = async () => {
    ApiGroup(
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
        groupId: props.match.params.group,
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
            ...post.groupfile.map((f) => {
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
