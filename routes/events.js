const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  postAddEvent,
  postDeleteEvent,
  getAllEvents,
} = require("../controllers/admin/events");

router.route("/").get(getAllEvents);
router.route("/add-event").post(auth, postAddEvent);
router.route("/delete-event").post(auth, postDeleteEvent);

module.exports = router;
