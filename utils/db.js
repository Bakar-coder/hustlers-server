const config = require('config')

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: 'mongodb+srv://ghetto:yw7SMS8DpEXaZL56@ghettohustler.bqogt.mongodb.net/ghetto?retryWrites=true&w=majority'
  };
} else module.exports = { mongoURI: "mongodb://localhost:27017/rest-api" };
