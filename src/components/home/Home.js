import React from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Home.css";

export const HomePage = (props) => {
  let iconStyle = {
    fontSize: "30px",
    width: "100px",
    color: "rgba(0, 0, 0, 0.45)",
  };
  return (
    <React.Fragment>
      <div className="card">
        <Link to="/register">
          <UserAddOutlined className="icon" style={iconStyle} />
          <div>
            <span>Register New User</span>
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
};
