const config = require("config"),
  Jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token)
    return res.status(400).json({ success: false, msg: "No token provided." });

  try {
    req.user = Jwt.verify(token, config.get("jwtPrivateKey"));
    next();
  } catch (ex) {
    return res
      .header("x-auth-token", null)
      .status(403)
      .json({ success: false, msg: "Access denied! - Invalid token." });
  }
};
