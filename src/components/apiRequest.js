import axios from "axios";

export const ApiRegister = (data) => {
  axios.post("api/register/", data).then((res) => console.log(res));
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

export const ApiCourse = (method,callback,args) => {
  return;
}

// export const ApiBatch = (callback) => {
//     axios.get("api/batch/").then(res => callback(res))
// }
