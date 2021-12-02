const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

//Proctect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }
  if (!token) {
    return next(new ErrorResponse("Not Authorized access to this token", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not Authorized access", 401));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`user roole ${req.user.role} is not authorized`, 403)
      );
    }
    next();
  };
};
