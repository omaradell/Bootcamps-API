const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Desc Get all Users
// Route GET /api/v1/auth/users
// accesss private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Desc Get User by id
// Route GET /api/v1/auth/users/:id
// accesss private/admin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Desc create user
// Route GET /api/v1/auth/users
// accesss private/admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc update user
// Route put /api/v1/auth/users/:id
// accesss private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Desc delete user
// Route delete /api/v1/auth/users/:id
// accesss private/admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
