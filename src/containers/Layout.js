import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  PageHeader,
  Popconfirm,
  Divider,
} from "antd";
import {
  DesktopOutlined,
  NotificationOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BookOutlined,
  LogoutOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import "./Layout.css";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { FiLogOut } from "react-icons/fi";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class CusLayout extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  static contextType = UserContext;
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      collapsed: true,
      theme: "dark",
      course: null,
    };
    // console.log(this.state.theme, typeof this.state.theme);
  }

  componentWillMount() {
    this.fetchCourse((data) => this.setState({ course: data }));
  }

  onCollapse = (collapsed) => {
    // console.log(collapsed);
    this.setState({ collapsed });
  };

  customTrigger = () => {
    return React.createElement(
      this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
      {
        className: "anticon anticon-left",
        style: {
          // color: this.state.theme == "light" ? "black" : "white",
          fontSize: "20px",
          marginTop: "15px",
        },
      }
    );
  };

  logout = async () => {
    const { cookies } = this.props;
    let i = await axios.post("dj-rest-auth/logout/");
    let res = await i.status;
    if (res == 200) {
      cookies.remove("tkn");
      document.location.reload();
    }
  };

  fetchCourse = async (callback) => {
    console.log("fdf");
    let request = await axios.get("api/course/");
    if (request.status == 200) {
      // console.log(request.data.results);
      callback(request.data.results);
    }
  };

  render() {
    const { user } = this.context;
    const { collapsed } = this.state;
    const pathnames = this.props.pathname.split("/").filter((x) => x);
    // console.log(user);
    return user && this.state.course ? (
      <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
        <Sider
          trigger={this.customTrigger()}
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            zIndex: 1,
          }}
          theme="dark"
        >
          <div className="logo" />
          <Menu
            // defaultSelectedKeys={["1"]}
            mode="inline"
            // style={{
            //   color:
            //     this.state.theme == "light" ? "rgba(0,0,0,0.87)" : "#ECECEC",
            //   backgroundColor:
            //     this.state.theme == "light" ? "rgba(0,0,0,0.87)" : "#242424",
            // }}
            theme="dark"
          >
            <Menu.Item key="1" icon={<NotificationOutlined />}>
              <Link to="/announcement">Announcement</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />}>
              <Link to="/course">Course</Link>
            </Menu.Item>
            {user.is_members.length ? (
              <>
                {/* <SubMenu
                key="sub1"
                icon={<TeamOutlined />}
                title="Group"
                onTitleClick={() => this.props.history.push("/group")}
              >
                {user.is_members.map((group) => (
                  <Menu.Item key={group.id}>
                    <Link to={`/group/${group.id}`}>{group.name}</Link>
                  </Menu.Item>
                ))}
              </SubMenu> */}
                <Menu.Item key="3" icon={<TeamOutlined />}>
                  <Link to="/group">Group</Link>
                </Menu.Item>
              </>
            ) : (
              <Menu.Item key="3" icon={<TeamOutlined />}>
                <Link to="/group">Group</Link>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: collapsed ? 80 : 200,
            zIndex: 0,
            transition: ".2s",
          }}
        >
          <PageHeader
            className="site-layout-background"
            style={{
              padding: "10px",
              backgroundColor: "#002140",
              position: "fixed",
              width: "100%",
              left: "0",
              zIndex: "1",
            }}
            extra={[
              <Popconfirm
                placement="bottomRight"
                title="You about to logout, are you sure?"
                onConfirm={this.logout}
                okText="Yes"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button key="1" type="primary">
                  <FiLogOut
                    style={{
                      position: "relative",
                      top: "3px",
                      marginRight: "3px",
                    }}
                  />
                  {user.username}
                </Button>
              </Popconfirm>,
            ]}
          ></PageHeader>
          <Content
            style={{
              marginTop: "60px",
              zIndex: "0",
              backgroundColor: "#EAEAEA",
            }}
          >
            <div>
              <Breadcrumb
                style={{
                  margin: "15px 0 0 25px",
                  position: "relative",
                  top: "5px",
                }}
              >
                {pathnames.map((x, i) => {
                  let path = `/${pathnames.slice(0, i + 1).join("/")}`;
                  {
                    /* console.log(path, pathnames); */
                  }
                  if (pathnames[0] == "course" && pathnames.length > 1) {
                    {
                      /* console.log(
                      this.state.course.find((e) => e.name == pathnames[1])
                    ); */
                    }
                    return (
                      <Breadcrumb.Item>
                        <Link
                          to={{
                            pathname: path,
                            state: {
                              course: this.state.course.find(
                                (e) => e.name == pathnames[1]
                              ),
                            },
                          }}
                        >
                          {x}
                        </Link>
                      </Breadcrumb.Item>
                    );
                  }
                  return (
                    <Breadcrumb.Item>
                      <Link onClick={() => this.props.history.push(path)}>
                        {x}
                      </Link>
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            </div>
            <div
              style={{
                margin: "30px",
                padding: "30px",
                backgroundColor: "white",
                minHeight: "60vh",
              }}
            >
              {this.props.children}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    ) : (
      <span></span>
    );
  }
}

export default withCookies(CusLayout);
