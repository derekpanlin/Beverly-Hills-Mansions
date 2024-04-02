const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotData } = require('../../utils/validation');

// Get all reviews of the current user
// GET /api/reviews/current

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        // Get all reviews written by current user
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'], include: [{ model: SpotImage, attributes: ['id', 'url'] }] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });

        const currentUserReviews = reviews.map(review => ({
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: review.User,
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.SpotImages.length > 0 ? review.Spot.SpotImages[0].url : null
            },
            ReviewImages: review.ReviewImages
        }));

        res.status(200).json({ Reviews: currentUserReviews })


    } catch (err) {
        next(err);
    }
});



// Create a review for a spot based on the spot's id
// POST /api/spots/:spotId/reviews

// router.post

module.exports = router;
