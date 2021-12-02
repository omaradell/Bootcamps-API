const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Desc Register User
// Route POSt /api/v1/auth/register
// accesss public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// Desc  User Login
// Route POSt /api/v1/auth/login
// accesss public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    return next(new ErrorResponse("please provide email and password"), 400);
  }

  //check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credintionals"), 401);
  }

  //check matceh password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credintionals"), 401);
  }

  sendTokenResponse(user, 200, res);
});

//get token , create cookie send res
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// Desc Get current User
// Route POSt /api/v1/auth/me
// accesss provate
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
