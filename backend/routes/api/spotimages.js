const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, authorize } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check, validationResult } = require('express-validator');


// DELETE A SPOT IMAGE
// DELETE /api/spot-images/:imageId

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    // Find spot image by Id
    const spotImage = await SpotImage.findByPk(imageId);

    // Check if spot image exists
    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    };

    // Check if spot belongs to current user
    const spot = await Spot.findByPk(spotImage.spotId)
    if (!spot || spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Unauthorized: Spot doesn't belong to current user"
        })
    };

    // Delete spot image
    await spotImage.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })
})

module.exports = router;
