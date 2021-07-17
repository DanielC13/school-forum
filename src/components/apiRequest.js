import axios from "axios";

export const ApiUsers = async (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      // console.log("GET method");
      axios.get(`api/register/`).then((res) => callback(res));
      break;
    case "post":
      // console.log("POST method");
      if (args.formdata) {
        let res = await axios
          .post("api/register/", args.formdata)
          .then((res) => callback(res))
          .catch((error) => error.response);
        return res;
      } else {
        console.log('POST method requires "formdata" in object argument');
      }
      break;
    case "retrieve":
      // console.log("RETRIEVE method");
      if (args.id) {
        await axios
          .get(`api/register/${args.id}/`)
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log('RETRIEVE method requires "id" in object argument');
      }
      break;
    case "patch":
      // console.log("PATCH method");
      if (args.id && args.formdata) {
        await axios
          .patch(`api/register/${args.id}/`, args.formdata)
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'PATCH method requires "id" and "formdata" in object arguments'
        );
      }
      break;
    case "delete":
      console.log("DELETE method");
      if (args.id) {
        await axios
          .delete(`api/register/${args.id}/`)
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log('DELETE method requires "id" in object arguments');
      }
      break;
    default:
      console.log("get, retrieve, post, patch & delete method is available");
  }
};

export const ApiAnnouncement = (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      // console.log("GET method");
      if (args.page) {
        axios
          .get(`api/announcement/?page=${args.page}`)
          .then((res) => callback(res));
      } else {
        console.log('GET method requires "page" in object argument ');
      }
      break;
    case "retrieve":
      if (args.id) {
        axios.get(`api/announcement/${args.id}/`).then((res) => {
          callback(res);
          return res.status;
        });
      } else {
        console.log('RETRIEVE method requires "id" in object argument');
      }
      break;
    case "post":
      // console.log("POST method");
      if (args.formdata) {
        axios
          .put("api/announcement/", args.formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => callback(res));
      } else {
        console.log('POST method requires "formdata" in object argument');
      }
      break;
    case "put":
      // console.log("PUT method");
      if (args.id && args.formdata) {
        axios
          .put(`api/announcement/${args.id}/`, args.formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            callback(res);
            return res.status;
          });
      } else {
        console.log(
          'PUT method requires "id" and "formdata" in object argument'
        );
      }
      break;
    case "delete":
      // console.log("DELETE method");
      if (args.id) {
        axios.delete(`api/announcement/${args.id}/`).then((res) => {
          if (res.status == 204) {
            callback(res);
            return res.status;
          } else {
            console.log("Failed to delete, try again");
            return res.status;
          }
        });
      } else {
        console.log('DELETE method requires "id" in object argument');
      }
      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
};

export const ApiCourse = async (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      // console.log("GET method");
      if (args.type) {
        switch (args.type) {
          case "posts":
            if (args.page && args.courseId) {
              await axios
                .get(`api/course/${args.courseId}/posts/?page=${args.page}`)
                .then((res) => callback(res))
                .catch((error) => callback(error.response));
            } else {
              console.log(
                'GET method with type "posts" requires "page" and "courseId" in object argument '
              );
            }
            break;
          case "detail":
            break;
          case "batch":
            if (!args.courseId)
              return console.log(
                '"batch" type requires "courseId" in object argument'
              );
            await axios
              .get(`http://127.0.0.1:8000/api/course/${args.courseId}/batch/`)
              .then((res) => {
                callback(res);
              })
              .catch((error) => callback(error.response));
            break;
          default:
            console.log("this type is not available");
            break;
        }
      } else {
        console.log(
          'GET method requires "type" in object argument, there are 2 available types ["posts","detail","batch"]'
        );
      }
      break;
    case "post":
      // console.log("POST method");
      if (args.courseId && args.formdata) {
        await axios
          .put(`api/course/${args.courseId}/posts/`, args.formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'POST method requires "courseId" and "formdata" in object argument'
        );
      }
      break;
    case "retrieve":
      // console.log("RETRIEVE method");
      if (args.courseId && args.id) {
        await axios
          .get(`api/course/${args.courseId}/posts/${args.id}/`)
          .then((res) => {
            callback(res);
          })
          .catch((error) => callback(error.response));
      }
      break;
    case "put":
      console.log("PUT method");
      if (args.courseId && args.id && args.formdata) {
        await axios
          .put(`api/course/${args.courseId}/posts/${args.id}/`, args.formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            callback(res);
          })
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'PUT method requires "id", "couresId" and "formdata" in object argument'
        );
      }
      break;
    case "delete":
      // console.log("DELETE method");
      if (args.courseId && args.id) {
        await axios
          .delete(`api/course/${args.courseId}/posts/${args.id}/`)
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'DELETE method requires "courseId" and "id" in object argument'
        );
      }
      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
  return;
};

export const ApiBatch = async (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  let {
    type = null,
    batchId = null,
    courseId = null,
    formdata = null,
    id = null,
  } = args;
  switch (method) {
    case "get":
      // console.log("GET method");
      switch (type) {
        case "posts":
          if (batchId && courseId) {
            await axios
              .get(`api/course/${courseId}/batch/${batchId}/posts/`)
              .then((res) => callback(res))
              .catch((error) => callback(error.response));
          } else {
            console.log(
              'GET method with type "posts" requires "batchId" and "courseId" in object argument '
            );
          }
          break;
        case "detail":
          if (!batchId || !courseId)
            return console.log(
              'GET method with type "detail" requires "batchId" and "courseId" in object argument '
            );
          await axios
            .get(`api/course/${courseId}/batch/${batchId}/`)
            .then((res) => callback(res))
            .catch((error) => callback(error.response));
          break;
        default:
          console.log(
            'GET method requires "type" in object argument, there is 2 available types ["posts","detail"]'
          );
          break;
      }
      break;
    case "post":
      // console.log("POST method");
      if (courseId && batchId) {
        await axios
          .put(`api/course/${courseId}/batch/${batchId}/posts/`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'POST method requires "batchId" and "courseId" in object argument'
        );
      }
      break;
    case "retrieve":
      // console.log("RETRIEVE method");
      if (courseId && id && batchId) {
        await axios
          .get(`api/course/${courseId}/batch/${batchId}/posts/${id}/`)
          .then((res) => {
            callback(res);
          })
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'RETRIEVE method requires "batchId", "id" and "courseId" in object argument'
        );
      }
      break;
    case "put":
      // console.log("PUT method");
      if (courseId && id && batchId && formdata) {
        await axios
          .put(`api/course/${courseId}/batch/${batchId}/posts/${id}/`, formdata)
          .then((res) => {
            callback(res);
          })
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'RETRIEVE method requires "batchId", "id", "formdata" and "courseId" in object argument'
        );
      }
      break;
    case "delete":
      // console.log("DELETE method");
      if (courseId && batchId && id) {
        await axios
          .delete(`api/course/${courseId}/batch/${batchId}/posts/${id}/`)
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'DELETE method requires "courseId" and "id" in object argument'
        );
      }
      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
};

export const ApiGroup = async (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  let { type = null, formdata = null, groupId = null, id = null } = args;
  switch (method) {
    case "get":
      // console.log("GET method");
      switch (type) {
        case "posts":
          if (groupId) {
            await axios
              .get(`api/group/${groupId}/posts/`)
              .then((res) => callback(res))
              .catch((error) => callback(error.response));
          } else {
            console.log('GET method requires "groupId" in object argument');
          }
          break;
        case "detail":
          break;
        default:
          console.log(
            'GET method requires "type" in object argument, there is 2 available types ["posts","detail"]'
          );
          break;
      }
      break;
    case "post":
      // console.log("POST method");
      if (groupId && formdata) {
        await axios
          .put(`api/group/${groupId}/posts/`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'POST method requires "groupid" and "formdata" in object argument'
        );
      }
      break;
    case "retrieve":
      // console.log("RETRIEVE method");
      if (groupId && id) {
        await axios
          .get(`api/group/${groupId}/posts/${id}/`)
          .then((res) => {
            callback(res);
          })
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'RETRIEVE method requires "groupId" and "id" in object argument'
        );
      }
      break;
    case "put":
      // console.log("PUT method");
      if (groupId && id && formdata) {
        await axios
          .put(`api/group/${groupId}/posts/${id}/`, formdata)
          .then((res) => {
            callback(res);
          })
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'RETRIEVE method requires "id", "formdata" and "groupId" in object argument'
        );
      }
      break;
    case "delete":
      console.log("DELETE method");
      if (groupId && id) {
        await axios
          .delete(`api/group/${groupId}/posts/${id}/`)
          .then((res) => callback(res))
          .catch((error) => callback(error.response));
      } else {
        console.log(
          'DELETE method requires "groupId" and "id" in object argument'
        );
      }
      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
};
