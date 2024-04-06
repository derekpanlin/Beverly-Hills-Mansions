const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, authorize } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check, validationResult } = require('express-validator');


module.exports = router;
