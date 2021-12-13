const ErrorResponse = require("../utils/ErrorResponse");

const errorHandeler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err.stack.red);

  if (err.name === 1100) {
    const msg = "duplicate field value entered";
    error = new ErrorResponse(msg, 404);
  }
  if (err.name === "CastError") {
    const msg = `Resource not found with ${err.value}`;
    error = new ErrorResponse(msg, 400);
  }
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(msg, 400);
  }
  res.status(500).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandeler;
