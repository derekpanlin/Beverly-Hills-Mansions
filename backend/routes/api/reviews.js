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



// Add an image to a review based on the review's id
// POST /api/reviews/:reviewId/images

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body

    try {
        // Check if review exists
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" })
        };

        // Check if review belongs to user
        if (review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: Review doesn't belong to current user"
            })
        };

        // Error response for exceeding max of 10 images per resource
        const reviewImagesCount = await ReviewImage.count({ where: { reviewId } });
        if (reviewImagesCount >= 10) {
            return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
        };

        // Create and return new image 
        const newImage = await ReviewImage.create({ url, reviewId });
        res.status(200).json({
            id: newImage.id,
            url: newImage.url
        });

    } catch (err) {
        next(err);
    }
})

// EDIT A REVIEW
// PUT /api/reviews/:reviewId

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    
})

module.exports = router;
