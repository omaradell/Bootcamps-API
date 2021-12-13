const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// Desc Gett All Reviews
// Route GET /api/v1/reviews
// Route GET /api/v1/Bootcamps/:bootcampId/reviews
// accesss public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
  // const courses = await query;

  // res.status(200).json({
  //   success: true,
  //   count: courses.length,
  //   data: courses,
  // });
});

// Desc Gett Single Review
// Route GET /api/v1/reviews/:id
// accesss public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name ",
  });
  if (!review) {
    return next(
      new ErrorResponse(`no review found with ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: review });
});

// Desc Add Single Review to bootcamp
// Route POST /api/v1/bootcamp/:bootcampId/reviews
// accesss private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp found with  ${req.params.bootcampId}`, 400)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// Desc Update Single Review to bootcamp
// Route POST /api/v1/reviews/:id
// accesss private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Bootcamp found with  ${req.params.bootcampId}`, 400)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized`, 400));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// Desc Delete Single Review to bootcamp
// Route DELETE /api/v1/reviews/:id
// accesss private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No Bootcamp found with  ${req.params.bootcampId}`, 400)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized`, 400));
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
