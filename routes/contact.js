const express = require('express')
const router = new express.Router();
const {
    postContact,
  } = require("../controllers/contact");

router.route('/').post(postContact)

module.exports = router;