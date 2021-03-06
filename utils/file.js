const { videoPath, audioPath, imagePath } = require("./file-paths");
const fs = require("fs");

exports.deleteFile = (filePath) =>
  fs.unlink(filePath, (ex) => {
    if (ex) throw ex;
  });

exports.fileFilter = (res, file) => {
  const fileType = file.mimetype.split("/")[0];
  const filterMimes = (mimes, fileformat) => {
    const [validMimetype] = mimes.filter((mime) => mime === file.mimetype);
    if (!validMimetype)
      return res.status(400).json({
        success: false,
        msg: `Unsupported file, expected to upload ${fileformat} file but got ${fileType} file.`,
      });
  };

  const videoMimes = () => {
    const mimes = ["video/mp4", "video/webm", "video/x-matroska", "video/mpeg"];
    const fileformat = "Video";
    filterMimes(mimes, fileformat);
    const videoSize = 1024 * 1024 * 1024 * 2;
    if (file.size > videoSize)
      return res.status(400).json({
        success: false,
        msg: "Video file size should not exide 100Mbs",
      });
    return videoPath(file);
  };

  const audioMimes = () => {
    const mimes = ["audio/mp3", "audio/mpeg"];
    const fileformat = "Audio";
    filterMimes(mimes, fileformat);
    const audioSize = 1024 * 1024 * 500;
    if (file.size > audioSize)
      return res.status(400).json({
        success: false,
        msg: "Audio file size should not exide 100Mbs",
      });
    return audioPath(file);
  };

  const imageMimes = () => {
    const mimes = ["image/jpg", "image/png", "image/gif", "image/jpeg"];
    const fileformat = "Image";
    filterMimes(mimes, fileformat);
    const imageSize = 1024 * 1024 * 5;
    if (file.size > imageSize)
      return res
        .status(400)
        .json({ success: false, msg: "Image file size should not exide 5Mbs" });

    return imagePath(file);
  };

  return fileType === "video"
    ? videoMimes()
    : fileType === "audio"
    ? audioMimes()
    : fileType === "image"
    ? imageMimes()
    : null;
};
