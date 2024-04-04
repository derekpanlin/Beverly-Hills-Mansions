const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotData, handleValidationErrors } = require('../../utils/validation');
const { check, validationResult } = require('express-validator');

// GET ALL OF THE CURRENT USER'S BOOKINGS
// GET /api/bookings/current

module.exports = router;
