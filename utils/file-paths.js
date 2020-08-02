const videoExt = ["mkv", "mp4", "webm", "mpeg"];
const audioExt = ["mp3", "wav"];
const imageExt = ["jpg", "png", "gif", "jpeg"];

const filterExt = function (file) {
  return file.name.split(".")[1];
};

exports.videoPath = function (file) {
  const fileExt = filterExt(file);
  return videoExt.map((ext) => {
    if (fileExt === ext) return `media/videos/${Date.now() + "_" + file.name}`;
  });
};
exports.audioPath = function (file) {
  const fileExt = filterExt(file);
  return audioExt.map((ext) => {
    if (fileExt === ext) return `media/audios/${Date.now() + "_" + file.name}`;
  });
};
exports.imagePath = function (file, cover) {
  const fileExt = filterExt(file) || filterExt(cover);
  if (file)
    return imageExt.map((ext) => {
      if (fileExt === ext)
        return `media/images/${Date.now() + "_" + file.name}`;
    });
  else
    return imageExt.map((ext) => {
      if (fileExt === ext)
        return `media/images/${Date.now() + "_" + cover.name}`;
    });
};
