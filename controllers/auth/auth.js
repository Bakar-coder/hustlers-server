const { User, validateLogin, validateRegister } = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

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
