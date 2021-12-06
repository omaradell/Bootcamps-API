const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// Desc Gett All Courses
// Route GET /api/v1/Courses
// Route GET /api/v1/Bootcamps/:bootcampId/courses
// accesss public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
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

// Desc Gett single Courses
// Route GET /api/v1/Courses/:id
// accesss public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`no course found by id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Desc Add Courses
// Route POST /api/v1/bootcamps/:bootcampId/courses
// accesss private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`no bootcamp found by id ${req.params.bootcampId}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user ${req.user.id} has no access to add Course this boot camp ${bootcamp.id}`,
        400
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Desc update Courses
// Route PUT /api/v1/courses/:id
// accesss private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`no bootcamp found by id ${req.params.bootcampId}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user ${req.user.id} has no access to update Course this boot camp ${bootcamp.id}`,
        400
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Desc Delete Courses
// Route DELETE /api/v1/courses/:id
// accesss private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`no bootcamp found by id ${req.params.bootcampId}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user ${req.user.id} has no access to delete Course this boot camp ${bootcamp.id}`,
        400
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
