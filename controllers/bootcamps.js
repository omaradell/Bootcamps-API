const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const path = require("path");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// Desc Gett All
// Route GET /api/v1/bootcamps
// accesss public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  //add user to req.body
  req.body.user = req.user.id;
  //Check if user added a bootcamp or is and admin
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user has published a boot camp ${req.user.id}`,
        400
      )
    );
  }
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
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return res.status(404).json({ succes: false, msg: "not found" });
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user ${req.user.id} has no access to update this boot camp `,
        400
      )
    );
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return res.status(404).json({ succes: false, msg: "not found" });
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user ${req.user.id} has no access to delete this boot camp `,
        400
      )
    );
  }
  bootcamp.remove();
  res.status(201).json({
    success: true,
    data: {},
    msg: "bootcamp deleted ",
  });

  // res.json({success : true , msg :`delete booot of ${req.params.id}` })
});

// Desc Gett bootcamp with radius /distance
// Route GET /api/v1/bootcamps/raduis/:zipcode/:distance
// accesss privcate

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.lenght,
    data: bootcamps,
    msg: "bootcamps displayed",
  });
});

// Desc upload photo for bootcamp
// Route PUt /api/v1/bootcamps/:id/photo
// accesss Private

exports.photoUploadBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return res.status(404).json({ succes: false, msg: "not found" });
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `this user ${req.user.id} has no access to update this boot camp `,
        400
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("please upload file"), 400);
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("please upload an image file"), 400);
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `please upload an file less than ${process.env.MAX_FILE_UPLOAD}`
      ),
      400
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.erroe(err);
      return next(new ErrorResponse("problem with file upload"), 400);
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(201).json({
      success: true,
      data: file.name,
    });
  });
  console.log(file.name);
});
