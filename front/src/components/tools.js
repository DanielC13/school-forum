export const convertUTC = (time) => {
  var localtime = new Date(time);
  return `${localtime.toDateString()} | ${localtime.getHours()}:${localtime.getMinutes()}`;
};

export const fileType = (file) => {
  return file.split(".").pop();
};

export const fileName = (file) => {
  if (file) return file.split("/").pop();
};
