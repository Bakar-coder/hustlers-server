const { Media, validateMedia } = require("../../models/Media");
const { Promotion, validatePromotion } = require("../../models/Promotion");
const { fileFilter, deleteFile } = require("../../utils/file");
let path;
let coverPath;

exports.getAllMedia = async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });
  if (media) return res.json({ success: true, media });
};

// Post admin add Media
exports.postAddMedia = async (req, res) => {
  if (req.user.isMember || req.user.stuff) {
    const { error } = validateMedia(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, msg: error.details[0].message });

    let { file, cover } = req.files;
    const {
      title,
      artist,
      genre,
      releaseDate,
      type,
      description,
      category,
      published,
      featured,
    } = req.body;
    path = fileFilter(res, file);
    if (cover) coverPath = `media/images/${Date.now() + "_" + cover.name}`;
    const imageSize = 1024 * 1024 * 5;
    if (cover.size > imageSize)
      return res
        .status(400)
        .json({ success: false, msg: "Image file size should not exide 5Mbs" });

    const [filePath] = path && path.filter((route) => route);

    let media = await Media.findOne({ title });
    if (media)
      return res.status(400).json({
        success: false,
        msg: `Media with the title ${title} already exists`,
      });

    media = new Media({
      user: req.user.id,
      title,
      artist,
      genre,
      releaseDate,
      type,
      description,
      category,
      file: filePath,
      cover: coverPath,
      published,
      featured,
    });
    await media.save();
    await file.mv(`${filePath}`);
    await cover.mv(`${coverPath}`);
    return res.json({ success: true, msg: `${title} added successfully.` });
  }
};

// Post admin edit Media
exports.postEditMedia = async (req, res) => {
  const mediaId = req.body.id;
  const media = await Media.findById(mediaId);
  if (!media)
    return res.status(400).json({ success: false, msg: "no media found." });
  if (media.user === req.user.id || req.user.stuff) {
    const {
      title,
      artist,
      genre,
      releaseDate,
      type,
      description,
      category,
      published,
      featured,
    } = req.body;

    let file;
    let cover;
    if (req.files && req.files.file) {
      file = req.files.file;
      path = fileFilter(res, file);
    }
    if (req.files && req.files.cover) {
      cover = req.files.cover;
      coverPath = `media/images/${Date.now() + "_" + cover.name}`;
      const coverSize = 1024 * 1024 * 5;
      if (cover && cover.size > coverSize)
        return res
          .status(400)
          .json({ success: false, msg: "Cover size must not exceed 5Mb" });
    }

    const media = await Media.findOne({ _id: mediaId });
    if (title) media.title = title;
    if (artist) media.artist = artist;
    if (genre) media.genre = genre;
    if (type) media.type = type;
    if (releaseDate) media.releaseDate = releaseDate;
    if (description) media.description = description;
    if (category) media.category = category;
    if (price) media.price = price;
    if (featured) media.featured = featured;
    if (published) media.published = published;
    if (file) {
      const [filePath] = path && path.filter((route) => route);
      deleteFile(`${media.file}`);
      media.file = filePath;
      await file.mv(`${filePath}`);
    }
    if (cover) {
      deleteFile(`${media.cover}`);
      media.cover = coverPath;
      await cover.mv(`${coverPath}`);
    }
    await media.save();
    return res.json({
      success: true,
      msg: `updated ${media.title} successfully.`,
      media,
    });
  }
};

// Post admin delete Media
exports.postDeleteMedia = async function (req, res) {
  const { _id } = req.body;
  const media = await Media.findById(_id);
  if (req.user.id === media.user || req.user.stuff) {
    await Media.findByIdAndDelete(_id);
    deleteFile(`${media.file}`);
    deleteFile(`${media.cover}`);
    return res.json({
      success: true,
      msg: `deleted ${media.title} successfully.`,
    });
  }
};

// Promotions api..........................................................................
exports.getAllPromos = async (req, res) => {
  const promo = await Promotion.find().sort({ createdAt: -1 });
  if (promo) return res.json({ success: true, promo });
};

// Post admin add Promotion
exports.postAddPromo = async (req, res) => {
  if (req.user.member || req.user.stuff) {
    const { error } = validatePromotion(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, msg: error.details[0].message });
    let { file } = req.files;
    const { title, expDate, description } = req.body;
    path = fileFilter(res, file);
    const [filePath] = path && path.filter((route) => route);
    let promo = await Promotion.findOne({ title });
    if (promo)
      return res.status(400).json({
        success: false,
        msg: `There is a promotion running with the same title ${title}.`,
      });

    promo = new Promotion({
      user: req.user.id,
      title,
      expDate,
      description,
      file: filePath,
    });
    await promo.save();
    await file.mv(`${filePath}`);
    return res.json({
      success: true,
      msg: `${title} promotion is added successfully.`,
    });
  }
};

// Post admin delete Promo
exports.postDeletePromo = async function (req, res) {
  const { _id } = req.body;
  const promo = await Promotion.findById(_id);
  if (req.user.id === promo.user || req.user.stuff) {
    await Promotion.findByIdAndDelete(_id);
    deleteFile(`${promo.file}`);
    return res.json({
      success: true,
      msg: `deleted ${promo.title} successfully.`,
    });
  }
};
