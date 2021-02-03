import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const Loading = () => {
  return (
    <div
      style={{
        height: "50vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
    </div>
  );
};

export default Loading;
