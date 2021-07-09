import axios from "axios";

export const ApiUsers = async (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      console.log("GET method");
      axios.get(`api/register/`).then((res) => callback(res));
      break;
    case "post":
      console.log("POST method");
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
    case "delete":
      console.log("DELETE method");

      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
};

export const ApiAnnouncement = (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      console.log("GET method");
      if (args.page) {
        axios
          .get(`api/announcement/?page=${args.page}`)
          .then((res) => callback(res));
      } else {
        console.log('POST method requires "page" in object argument ');
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
      console.log("POST method");
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
      console.log("PUT method");
      if (args.id) {
        axios
          .put(`api/announcement/${args.id}/`, args.formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            callback(res);
            return res.status;
          });
      } else {
        console.log('PUT method requires "id" in object argument');
      }
      break;
    case "delete":
      console.log("DELETE method");
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

export const ApiCourse = (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      // console.log("GET method");
      if (args.type == "posts") {
        return;
      } else if (args.type == "detail") {
        return;
      } else if (args.type == "batch") {
        if (!args.courseId)
          return console.log(
            '"batch" type requires "courseId" in object argument'
          );
        axios
          .get(`http://127.0.0.1:8000/api/course/${args.courseId}/batch/`)
          .then((res) => {
            callback(res);
          });
        return;
      } else {
        console.log(
          'GET method requires "type" in object argument, there is 2 available types ["posts","detail","batch"]'
        );
      }
      break;
    case "post":
      console.log("POST method");
      break;
    case "delete":
      console.log("DELETE method");

      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
  return;
};

export const ApiBatch = (method, callback, args) => {
  if (!args) return console.log("requires object arguments");
  switch (method) {
    case "get":
      console.log("GET method");
      if (args.type == "posts") {
        return;
      } else if (args.type == "detail") {
        return;
      } else {
        console.log(
          'GET method requires "type" in object argument, there is 2 available types ["posts","detail"]'
        );
      }
      break;
    case "post":
      console.log("POST method");
      break;
    case "delete":
      console.log("DELETE method");

      break;
    default:
      console.log("get, retrieve, post, put & delete method is available");
  }
};