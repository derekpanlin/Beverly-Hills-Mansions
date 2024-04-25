const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, authorize } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check, validationResult } = require('express-validator');

// DELETE A REVIEW IMAGE
// DELETE /api/review-images/:imageId

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    // Find review image by the imageId
    const reviewImage = await ReviewImage.findByPk(imageId);


    // Check if review image exists
    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    };

    // Check that review belongs to the current user
    const review = await Review.findByPk(reviewImage.reviewId);
    if (review.userId !== req.user.id) {
        return res.status(403).json({
            message: "Unauthorized: Review doesn't belong to current user"
        })
    }

    await reviewImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
})
module.exports = router;
