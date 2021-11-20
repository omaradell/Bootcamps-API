const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// Desc Gett All
// Route GET /api/v1/bootcamps
// accesss public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find();
  res.status(200).json({
    success: true,
    data: bootcamp,
    msg: "bootcamps displayed",
  });
});

// Desc Gett bootcamp
// Route GET /api/v1/bootcamps/:id
// accesss public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    res.status(201).json({
      success: true,
      data: bootcamp,
      msg: "bootcamp found",
    });
  
});

// Desc Create Bootcamps
// Route POST /api/v1/bootcamps
// accesss private

exports.createBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
      msg: "bootcamp created",
    });
  });

// Desc Update
// Route PUT /api/v1/bootcamps/:id
// accesss Private

exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(404).json({ succes: false, msg: "not found" });
  }
  res.status(201).json({
    success: true,
    data: bootcamp,
    msg: "bootcamp updated",
  });
});
  // res.json({success : true , msg :`update booot of ${req.params.id}` })

// Desc delete
// Route DELETE /api/v1/bootcamps/:id
// accesss Private

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ succes: false, msg: "not found" });
    }
    res.status(201).json({
      success: true,
      data: bootcamp,
      msg: "bootcamp deleted ",
    });
 
  // res.json({success : true , msg :`delete booot of ${req.params.id}` })
});
