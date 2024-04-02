const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotData } = require('../../utils/validation')

// Get all reviews of the current user
// GET /api/reviews/current

router.get('/current', requireAuth, async (req, res, next) => {
    
})

module.exports = router;
