import axios from "axios";

export const ApiRegister = (data) => {
  axios.post("api/register/", data).then((res) => console.log(res));
};


export const ApiAnnouncement = (method, callback, args) => {
  switch (method) {
    case "get":
      if (args.page) {
        console.log(args.page);
        axios
          .get(`api/announcement/?page=${args.page}`)
          .then((res) => callback(res));
      }
      break;
  }
};

// export const ApiBatch = (callback) => {
//     axios.get("api/batch/").then(res => callback(res))
// }
