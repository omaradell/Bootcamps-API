const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  updateBootcamps,
  deleteBootcamps,
  createBootcamps,
  getBootcampsInRadius,
  photoUploadBootcamp,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");

const advancedResults = require("../middleware/advancedResults");

//include resorces

const courseRouter = require("./courses");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//RE-route
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), photoUploadBootcamp);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamps);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamps)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamps);

module.exports = router;
