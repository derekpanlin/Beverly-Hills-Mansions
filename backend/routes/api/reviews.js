const express = require('express');
const router = express.Router();

const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

// Custom validation for validating review data
const validateReview = [
    check('review').notEmpty().withMessage('Review text is required'),
    check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors,
];

// Custom validation for validating review image
const validateReviewImage = [
    check('url')
        .notEmpty()
        .withMessage('Image url is required')
]


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
                state: review.Spot.state,
                country: review.Spot.country,
                lat: parseFloat(review.Spot.lat),
                lng: parseFloat(review.Spot.lng),
                name: review.Spot.name,
                price: parseFloat(review.Spot.price),
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

router.post('/:reviewId/images', requireAuth, validateReviewImage, async (req, res, next) => {
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

router.put('/:reviewId', requireAuth, validateReview, handleValidationErrors, async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    try {
        // Check if existing review exists 
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        };

        // Check if current user owns the review
        if (existingReview.userId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: Review doesn't belong to current user"
            })
        };

        // Updated the review
        await existingReview.update({ review, stars });

        // Have to refetch the new updated review
        const updatedReview = await Review.findByPk(reviewId);

        res.status(200).json(updatedReview)


    } catch (err) {
        next(err);
    }
});

// DELETE AN EXISTING REVIEW
// DELETE /api/reviews/:reviewId

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;

    try {
        // Review must belong to current user
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        };

        if (existingReview.userId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: Review doesn't belong to current user"
            })
        };

        // Delete the review
        await existingReview.destroy();

        res.status(200).json({
            message: "Successfully deleted"
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router;
