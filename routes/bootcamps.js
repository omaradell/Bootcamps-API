const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  updateBootcamps,
  deleteBootcamps,
  createBootcamps,
  getBootcampsInRadius,
  photoUploadBootcamp
} = require("../controllers/bootcamps");

const  Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

//include resorces 

const courseRouter = require('./courses');
const router = express.Router();

 //RE-route 
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamps);
router.route('/:id').get(getBootcamp).put(updateBootcamps).delete(deleteBootcamps);
router.route('/:id/photo').put(photoUploadBootcamp);


module.exports = router;
