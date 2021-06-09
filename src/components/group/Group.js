import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../AllContext";
import { Card, Empty, Button, List, Spin, Space } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Loading from "../Loading";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import { convertUTC, fileType, fileName } from "../tools";
const { Meta } = Card;
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
                console.log(props.match.params.id);
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
    }, true);
  }, [props.match.params.id]);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const fetchData = (callback, resetpage) => {
    if (resetpage) {
      // console.log("am i joke");
      setHasmore(true);
      setPage(1);
      console.log(page);
    }
    axios
      .get(`api/group/${props.match.params.id}/posts/?page=${page}`)
      .then((res) => {
        callback(res.data);
        setPage((page) => page + 1);
      });
    console.log(page);
  };

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    console.log(status);
    if (status.next == null) {
      // message.warning("Infinite List loaded all");
      setHasmore(false);
      setLoading(false);
      return;
    }
    fetchData((res) => {
      console.log("omegalul");
      let newdata = data.concat(res.results);
      // cannot do page++
      setStatus(res);
      setData(newdata);
      setLoading(false);
    }, false);
    console.log("onload");
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
            onClick={() => props.history.push("/group/add")}
          >
            + New Post
          </Button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={1}
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
