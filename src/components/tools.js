import {
  LoadingOutlined,
  FilePdfTwoTone,
  FileExcelTwoTone,
  FileWordTwoTone,
  FilePptTwoTone,
  FileZipTwoTone,
  FileTextTwoTone,
  PlaySquareTwoTone,
  PictureTwoTone,
  PaperClipOutlined,
} from "@ant-design/icons";

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

export const handleIconRender = (file, listType) => {
  const fileSufIconList = [
    { type: <FilePdfTwoTone />, suf: [".pdf"] },
    { type: <FileExcelTwoTone />, suf: [".xlsx", ".xls", ".csv"] },
    { type: <FileWordTwoTone />, suf: [".doc", ".docx"] },
    { type: <FilePptTwoTone />, suf: [".pptx", ".ppt", "pptm"] },
    { type: <FileZipTwoTone />, suf: [".zip"] },
    { type: <FileTextTwoTone />, suf: [".txt"] },
    { type: <PlaySquareTwoTone />, suf: [".mp4"] },
    {
      type: <PictureTwoTone />,
      suf: [
        ".webp",
        ".svg",
        ".png",
        ".gif",
        ".jpg",
        ".jpeg",
        ".jfif",
        ".bmp",
        ".dpg",
      ],
    },
  ];
  // console.log(1, file, listType);
  let icon =
    file.status === "uploading" ? <LoadingOutlined /> : <PaperClipOutlined />;
  if (listType === "picture" || listType === "picture-card") {
    if (listType === "picture-card" && file.status === "uploading") {
      icon = <LoadingOutlined />; // or icon = 'uploading...';
    } else {
      fileSufIconList.forEach((item) => {
        if (item.suf.includes(file.name.substr(file.name.lastIndexOf(".")))) {
          icon = item.type;
        }
      });
    }
  }
  return icon;
};
