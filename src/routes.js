import React, { useEffect, useState, useContext } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import {
  LoginForm,
  PasswordResetForm,
  PasswordResetConfirm,
} from "./containers/Login";
import CusLayout from "./containers/Layout";
import { HomePage } from "./components/home/Home";
import { RegisterUser, UserList, EditUser } from "./components/users/Users";
import {
  Announcement,
  AnnouncementDetail,
  AnnouncementAdd,
  AnnouncementEdit,
} from "./components/announcement/Announcement";
import {
  Course,
  CoursePost,
  CoursePostAdd,
  CoursePostDetail,
  CoursePostEdit,
} from "./components/course/Course";
import {
  BatchPost,
  BatchPostAdd,
  BatchPostDetail,
  BatchPostEdit,
} from "./components/batch/Batch";
import {
  Group,
  GroupPost,
  GroupPostAdd,
  GroupPostDetail,
  GroupPostEdit,
} from "./components/group/Group";

const BaseRouter = (props) => {
  const {
    history,
    location: { pathname },
  } = props;
  // console.log(props.user);
  return props.verify ? (
    <CusLayout pathname={pathname} history={history}>
      {props.user ? (
        <div>
          {props.user.is_staff ? (
            <Switch>
              {/* This is for admin */}
              <Route exact path="/home" component={HomePage} />
              <Route exact path="/users" component={UserList} />
              <Route exact path="/users/register" component={RegisterUser} />
              <Route exact path="/users/:id" component={EditUser} />
              <Route exact path="/announcement" component={Announcement} />
              <Route
                exact
                path="/announcement/add"
                component={AnnouncementAdd}
              />
              <Route
                exact
                path="/announcement/:id"
                component={AnnouncementDetail}
              />
              <Route
                exact
                path="/announcement/:id/edit"
                component={AnnouncementEdit}
              />
              <Route exact path="/course" component={Course} />
              <Route exact path="/course/:course" component={CoursePost} />
              <Redirect
                exact
                path="/course/:course/batch"
                to="/course/:course"
              />
              <Route
                exact
                path="/course/:course/add"
                component={CoursePostAdd}
              />
              <Route
                exact
                path="/course/:course/:id"
                component={CoursePostDetail}
              />
              <Route
                exact
                path="/course/:course/:id/edit"
                component={CoursePostEdit}
              />
              <Route
                exact
                path="/course/:course/batch/:batch"
                component={BatchPost}
              />
              <Route
                exact
                path="/course/:course/batch/:batch/add"
                component={BatchPostAdd}
              />
              <Route
                exact
                path="/course/:course/batch/:batch/:id"
                component={BatchPostDetail}
              />
              <Route
                exact
                path="/course/:course/batch/:batch/:id/edit"
                component={BatchPostEdit}
              />
              <Route exact path="/group" component={Group} />
              <Route exact path="/group/:group" component={GroupPost} />
              <Route exact path="/group/:group/add" component={GroupPostAdd} />
              <Route
                exact
                path="/group/:group/:id"
                component={GroupPostDetail}
              />
              <Route
                exact
                path="/group/:group/:id/edit"
                component={GroupPostEdit}
              />
              <Redirect from="*" to="/home" />
            </Switch>
          ) : (
            <Switch>
              {/* this is for student */}
              <Route exact path="/announcement" component={Announcement} />
              <Route
                exact
                path="/announcement/:id"
                component={AnnouncementDetail}
              />
              <Route exact path="/course" component={Course} />
              <Route exact path="/course/:course" component={CoursePost} />
              <Route exact path="/group" component={Group} />
              <Route exact path="/group/:id" component={GroupPost} />
              <Redirect from="*" to="/home" />
            </Switch>
          )}
        </div>
      ) : (
        <Switch></Switch>
      )}
    </CusLayout>
  ) : (
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <Route exact path="/password-reset" component={PasswordResetForm} />
      <Route
        path="/password-reset-confirm/:uid/:token"
        component={PasswordResetConfirm}
      />
      <Redirect from="*" to="/login" />
    </Switch>
  );
};

export default withRouter(BaseRouter);
