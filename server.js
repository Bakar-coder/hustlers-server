"use strict";
require("express-async-errors");
require("joi-objectid");
const express = require("express");
const config = require("config");
const compression = require("compression");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const { join } = require("path");
const db = require("./utils/db");
const helmet = require("helmet");
const port = process.env.PORT || 5000;
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("************ No private provided *************");
  process.exit(1);
}

if (!config.get("PAYPAL_CLIENT_ID")) {
  console.error("************ NO PAYPAL_CLIENT_ID ADDED *************");
  process.exit(1);
}

if (!config.get("PAYPAL_CLIENT_SECRET")) {
  console.error("************ NO PAYPAL_CLIENT_SECRET ADDED *************");
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const adminProducts = require("./routes/admin/products");
const products = require("./routes/products/products");
const shop = require("./routes/shop");
const media = require("./routes/media");
const events = require("./routes/events");

const accessLogStream = fs.createWriteStream(join(__dirname, "errors.log"), {
  flags: "a",
});

app.use(express.json({ limit: "10000mb" }));
app.use(express.urlencoded({ limit: "10000mb", extended: false }));
app.use(express.static(join(__dirname, "media")));
app.use("/media", express.static(join(__dirname, "media")));
app.use("/media/videos", express.static(join(__dirname, "media/videos")));
app.use("/media/photos", express.static(join(__dirname, "media/photos")));
app.use("/media/audios", express.static(join(__dirname, "media/audios")));
app.use(cors());
app.use(
  morgan("combined", {
    stream: accessLogStream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(
  fileUpload({
    limits: { fileSize: 1024 * 1024 * 1024 * 6 },
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);
app.use(helmet());
app.use(compression());

// create api router
app.use("/api/users", authRoutes);
app.use("/api/products", products);
app.use("/api/shop", shop);
app.use("/api/media", media);
app.use("/api/events", events);
app.use("/api/admin/products", adminProducts);

mongoose
  .connect(db.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("Connected to mongodb database.");
    app.listen(port, () => console.log(`Server started on port: ${port}.`));
  })
  .catch((ex) => console.log("Database Connection Error! -", ex));
