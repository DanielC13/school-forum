import React, { useState, useEffect, useContext } from "react";
import { message, List } from "antd";
import { CourseContext } from "../../AllContext";
import { convertUTC } from "../tools";
import { ApiBatch } from "../apiRequest";

export const BatchPost = (props) => {
  const [posts, setPosts] = useState(null);
  const allcourse = useContext(CourseContext);
  let findcourse = allcourse.find((e) => e.name == props.match.params.course);

  useEffect(() => {
    if (!findcourse) {
      message.error(`"${props.match.params.course}" Course was not found!`);
      return props.history.push("/course");
    }
    fetchData((res) => setPosts(res));
    document.addEventListener("scroll", trackScroll);
  }, []);

  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom <= window.outerHeight;
  };
  const trackScroll = () => {
    const wrappedElement = document.getElementById("footer");
    if (isBottom(wrappedElement)) {
      console.log("bottom reached!");
      document.removeEventListener("scroll", trackScroll);
    }
  };

  const fetchData = async (callback) => {
    await ApiBatch("get", (res) => callback(res.data.results), {
      type: "posts",
      courseId: findcourse.id,
      batchId: props.match.params.batch,
    });
  };
  return posts ? (
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
    </div>
  ) : (
    <p>loading ...</p>
  );
};
