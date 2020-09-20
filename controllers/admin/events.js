const { Event, validateEvent } = require("../../models/Event");
const { fileFilter, deleteFile } = require("../../utils/file");

// event api..........................................................................
exports.getAllEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  if (events) return res.json({ success: true, events });
};

exports.postAddEvent = async (req, res) => {
  if (req.user.stuff) {
    const { error } = validateEvent(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, msg: error.details[0].message });
    let { file } = req.files;
    const { title, date, venue, description } = req.body;
    path = fileFilter(res, file);
    const [filePath] = path && path.filter((route) => route);
    let event = await Event.findOne({ title });
    if (event)
      return res.status(400).json({
        success: false,
        msg: `There is an event running with the same title ${title}.`,
      });

    event = new Event({
      user: req.user.id,
      title,
      venue,
      date,
      description,
      file: filePath,
    });
    await event.save();
    await file.mv(`${filePath}`);
    return res.json({
      success: true,
      msg: `${title} event is added successfully.`,
    });
  }
};

exports.postDeleteEvent = async function (req, res) {
  const { _id } = req.body;
  const event = await Event.findById(_id);
  if (req.user.id === event.user || req.user.stuff) {
    await Event.findByIdAndDelete(_id);
    deleteFile(`${event.file}`);
    return res.json({
      success: true,
      msg: `deleted ${event.title} successfully.`,
    });
  }
};
