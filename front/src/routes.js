import React, { useEffect, useState, useContext } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import {
  LoginForm,
  PasswordResetForm,
  PasswordResetConfirm,
} from "./containers/Login";
import CusLayout from "./containers/Layout";
import {
  Announcement,
  AnnouncementDetail,
  AnnouncementAdd,
  AnnouncementEdit,
} from "./components/announcement/Announcement";
import { Course, CoursePost, CoursePostAdd } from "./components/course/Course";
import { Group, GroupPost } from "./components/group/Group";
import { UserContext } from "./UserContext";

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
              <Route
                exact
                path="/course/:course/add"
                component={CoursePostAdd}
              />
              <Route exact path="/group" component={Group} />
              <Route exact path="/group/:id" component={GroupPost} />
              <Redirect from="*" to="/announcement" />
            </Switch>
          ) : (
            <Switch>
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
              <Redirect from="*" to="/announcement" />
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