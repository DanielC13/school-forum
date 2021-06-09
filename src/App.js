import "./App.less";
import { useEffect, useState, useMemo } from "react";
import React from "react";
import axios from "axios";
import CusLayout from "./containers/Layout";
import BaseRouter from "./routes";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { UserContext, CourseContext } from "./AllContext";

// axios.defaults.baseURL =
//   document.location.origin == "http://localhost:3000"
//     ? "https://school-forum-dc.herokuapp.com"
//     : document.location.origin;

axios.defaults.baseURL = "http://127.0.0.1:8000";
console.log(axios.defaults.baseURL, typeof document.location.origin);

function App() {
  const [user, setUser] = useState(null);
  const [allcourse, setAllCourse] = useState([]);
  const UserProviderValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const CourseProviderValue = useMemo(() => ({ allcourse, setAllCourse }), [
    allcourse,
    setAllCourse,
  ]);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  let boo = () => {
    if (cookies.tkn) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${cookies.tkn}`;
      return true;
    }
    return false;
  };
  const [verification, setverification] = useState(boo());
  const verify = async () => {
    try {
      if (cookies.tkn) {
        let res = await axios.post("dj-rest-auth/token/verify/", {
          token: cookies.tkn,
        });
        let stat = await res.status;
        if (stat == 200) {
          console.log(stat);
          let userdetail = await axios.get("dj-rest-auth/user/");
          let allcourse = await axios.get("api/course/");
          setUser(userdetail.data);
          setAllCourse(allcourse.data.results);
          return true;
        }
        return false;
      }
    } catch (error) {
      // delete axios.defaults.headers.common["Authorization"];
      removeCookie("tkn");
      console.log("catch error");
      setUser(null);
      // window.location.reload();
      return false;
    }
    return false;
  };

  useEffect(() => {
    verify().then((res) => setverification(res));
  }, []);

  // console.log(verification);
  return (
    <div className="App">
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400&display=swap"
      />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
        rel="stylesheet"
      ></link>
      <CookiesProvider>
        <UserContext.Provider value={UserProviderValue}>
          <CourseContext.Provider value={CourseProviderValue}>
            <BrowserRouter>
              <BaseRouter
                href="this.props.href"
                verify={verification}
                user={user}
              ></BaseRouter>
            </BrowserRouter>
          </CourseContext.Provider>
        </UserContext.Provider>
      </CookiesProvider>
    </div>
  );
}

export default App;
