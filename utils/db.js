if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://casper:h0L4Vc7Hw1LJ1N0P@ecom-app-qkg4p.mongodb.net/Ecom-app?retryWrites=true&w=majority",
  };
} else module.exports = { mongoURI: "mongodb://localhost:27017/rest-api" };
