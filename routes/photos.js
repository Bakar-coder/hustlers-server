const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");


const {
    getPhotos, postPhotos, postDeletePhoto
} = require("../controllers/products/photos");

router.route("/").get(getPhotos);
router.route("/add-photo").post(auth, postPhotos);
router.route("/delete-photo").post(auth, postDeletePhoto);

module.exports = router;