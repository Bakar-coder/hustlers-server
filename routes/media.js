const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  postAddMedia,
  postEditMedia,
  postDeleteMedia,
  getAllMedia,
  getAllPromos,
  postAddPromo,
  postDeletePromo,
} = require("../controllers/admin/media");

router.route("/").get(getAllMedia);
router.route("/add-media").post(auth, postAddMedia);
router.route("/edit-media").post(auth, postEditMedia);
router.route("/delete-media").post(auth, postDeleteMedia);
router.route("/add-promo").post(auth, postAddPromo);
router.route("/delete-promo").post(auth, postDeletePromo);
router.route("/promos").get(getAllPromos);

module.exports = router;
