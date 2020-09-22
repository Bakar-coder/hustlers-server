const config = require('config')

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://localhost:27017/rest-api"
  };
} else module.exports = { mongoURI: "mongodb://localhost:27017/rest-api" };
