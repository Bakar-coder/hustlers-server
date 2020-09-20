const { Photo, validatePhoto } = require("../../models/Photos");
const { fileFilter, deleteFile } = require("../../utils/file");
let path;
exports.getPhotos = async (req, res) => {
    const photos = await Photo.find();
    return res.json({ success: true, photos })
};

exports.postPhotos = async (req, res) => {
    const { error } =  validatePhoto(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, msg: error.details[0].message });

    const { file } = req.files
    const { title, description } = req.body;
    if (!file) return res.status(400).json({ success: false, msg: 'image field not allowed empty. ' })
    path = fileFilter(res, file);
    const [filePath] = path && path.filter((route) => route);
    let photo = await Photo.findOne({ title })
    if (photo)
        return res.status(400).json({
            success: false,
            msg: `Image with the title ${title} already exists`,
        });

    photo = new Photo({
        title, description, file: filePath
    })
    await photo.save()
    await file.mv(`${filePath}`);
    return res.json({ success: true, msg: `${title} added successfully.` })
}


exports.postDeletePhoto = async function (req, res) {
    if (req.user.stuff) {
        const { _id } = req.body;
        const photo = await Photo.findById(_id);
        await Photo.findByIdAndDelete(_id);
        deleteFile(`${photo.file}`);
        return res.json({
            success: true,
            msg: `deleted ${photo.title} successfully.`,
        });
    }
};