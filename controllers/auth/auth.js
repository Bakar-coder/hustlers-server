const { User, validateLogin, validateRegister } = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.registerUser = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  const { firstName, lastName, username, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({
      success: false,
      msg: `Email - ${email} is already taken.`,
    });
  user = await User.findOne({ username });
  if (user)
    return res.status(400).json({
      success: false,
      msg: `Username ${username} is already taken.`,
    });

  const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
  user = new User({ firstName, lastName, username, email, password, avatar });
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  return res.json({
    success: true,
    msg: `${user.firstName} ${user.lastName} account has been created successfully.`,
  });
};

exports.loginUser = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      success: false,
      msg: `Invalid email or password.`,
    });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({
      success: false,
      msg: `Invalid email or password.`,
    });

  const token = user.generateAuthToken();
  return res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .json({ success: true, msg: `welcome back, login successful`, token });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.status(400).json({ success: false, error: err });

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        transporter.sendMail({
          to: req.body.email,
          from: "shop@node-complete.com",
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return res.status(400).json({ success: false, error });
      });
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.json({
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return res.status(400).json({ success: false, error });
    });
};

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      return res
        .status(200)
        .json({ success: true, msg: "password reset success" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return res.status(400).json({ success: false, error });
    });
};
