const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotData, handleValidationErrors } = require('../../utils/validation')
const { check, validationResult } = require('express-validator');

// GET All spots --> /api/spots

router.get('/', async (req, res, next) => {
    try {
        // Fetch all spots from db
        const spots = await Spot.findAll({
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: Review,
                    attributes: ['stars'],
                    required: false
                },
                {
                    model: SpotImage,
                    where: { preview: true },
                    attributes: ['url'],
                    required: false
                }
            ]
        });

        // Calculate average rating for each spot
        const formattedSpots = spots.map(spot => {
            const numReviews = spot.Reviews.length;
            const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, cur) => acc + cur.stars, 0) / numReviews : 0;

            return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating: avgStarRating,
                previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null
            };
        });

        res.status(200).json({ Spots: formattedSpots });
    } catch (err) {
        next(err);
    }
});


// Get all Spots owned/created by the current user
// GET /api/spots/current

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        // Fetch all spots from db
        const spots = await Spot.findAll({
            where: {
                ownerId: req.user.id
            },
            attributes: [
                'id',
                'ownerId',
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'description',
                'price',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: Review,
                    attributes: ['stars'],
                    required: false
                },
                {
                    model: SpotImage,
                    where: { preview: true },
                    attributes: ['url'],
                    required: false
                }
            ],

        });

        // Calculate average rating for each spot
        const formattedSpots = spots.map(spot => {
            const numReviews = spot.Reviews.length;
            const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, cur) => acc + cur.stars, 0) / numReviews : 0;

            return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating: avgStarRating,
                previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null
            };
        });

        res.status(200).json({ Spots: formattedSpots });
    } catch (err) {
        next(err);
    }
})

// GET DETAILS OF A SPOT FROM AN ID
// GET /api/spots/:spotId

router.get('/:spotId', async (req, res, next) => {
    try {
        // Extract spotId from params
        const { spotId } = req.params;

        // Get spot from an id
        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Review,
                    attributes: ['id', 'stars']
                }
            ]
        });

        if (!spot) {
            const error = new Error("Spot couldn't be found");
            error.status = 404;
            throw error;
        }

        // calculate average star rating
        const numReviews = spot.Reviews.length;
        const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, cur) => acc + cur.stars, 0) / numReviews : 0;

        res.status(200).json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: numReviews,
            avgStarRating: avgStarRating,
            SpotImages: spot.SpotImages,
            Owner: spot.User
        });

    } catch (err) {
        next(err);
    }
});

// CREATE A SPOT
// POST /api/spots

router.post('/', requireAuth, validateSpotData, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const spot = await Spot.create({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            ownerId: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt
        })

    } catch (error) {
        next(error);
    }
})

// ADD AN IMAGE TO A SPOT BASED ON THE SPOT'S ID
// POST /api/spots/:spotId/images

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: Spot doesn't belong to the current user"
            });
        }

        // Creating a new image for the spot
        const newImage = await SpotImage.create({ url, preview, spotId });

        res.status(200).json({
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        });

    } catch (err) {
        next(err)
    }

});

// EDIT A SPOT
// PUT /api/spots/:spotId

router.put('/:spotId', requireAuth, validateSpotData, async (req, res, next) => {
    const { spotId } = req.params;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    try {
        const spot = await Spot.findByPk(spotId);

        // Check if spot exists
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        }

        // Check if spot belongs to the current user
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: Spot doesn't belong to current user"
            })
        }

        // Update the spot with the new data
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        // Save updated spot
        await spot.save();

        res.status(200).json(spot);


    } catch (err) {
        next(err);
    }

})

// DELETE A SPOT
// DELETE /api/spots/:spotId

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            res.status(404).json({
                message: "Spot couldn't be found"
            })
        };

        // Check if spot belongs to the current user
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: Spot doesn't belong to current user"
            })
        }

        await spot.destroy();

        res.status(200).json({
            message: "Successfully deleted"
        })


    } catch (err) {
        next(err);
    }
})

// Get all reviews by a spot's ID
// GET /api/spots/:spotId/reviews

router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    try {
        // Find spot by id
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Find all reviews for that spot
        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });

        if (!reviews.length) {
            return res.status(404).json({
                message: "Spot has no reviews"
            });
        } else {
            return res.status(200).json({ Reviews: reviews })
        }
    } catch (err) {
        next(err);
    }
});

// Create a review for a spot based on the spot's id
// POST /api/spots/:spotId/reviews

router.post('/:spotId/reviews', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;

    try {
        // Check if spot exists
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        }

        // Check if current user already has a review for the spot
        const existingReview = await Review.findOne({
            where: { spotId, userId: req.user.id }
        });

        if (existingReview) {
            return res.status(500).json({ message: "User already has a review for this spot" })
        };

        // Create review
        const newReview = await Review.create({
            userId: req.user.id,
            spotId,
            review,
            stars
        });

        res.status(201).json(newReview);


    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = {};
            err.errors.forEach(error => {
                errors[error.path] = error.message;
            });
            return res.status(400).json({ message: 'Bad Request', errors });
        }
        next(err);

    }
});

// GET ALL BOOKINGS FOR A SPOT BASED ON SPOT'S ID
// GET /api/spots/:spotId/bookings

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        // console.log(spot)

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        // Fetch bookings for the spot
        let bookings = await Booking.findAll({
            where: { spotId },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })

        // If current user is owner, include user details in body
        if (req.user.id === spot.ownerId) {
            res.json({ Bookings: bookings });
        } else {
            // If current user isn't owner, just show the bookings
            bookings = bookings.map(booking => {
                return {
                    spotId: booking.spotId,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                };
            });
            res.json({ Bookings: bookings })
        }
    } catch (err) {
        next(err)
    }
})

// CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID
// POST /api/spots/:spotId/bookings

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    try {
        const spot = await Spot.findByPk(spotId);

        // Send error if spot not found
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        };

        // Check if spot belongs to current user
        if (spot.ownerId === req.user.id) {
            return res.status(403).json({
                message: "Spot belongs to current user and cannot be booked."
            })
        }

        // Check if spot has booking conflict
        const existingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } }
                ]
            }
        });

        // If conflict exists, send error message
        if (existingBooking) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        };

        // Create the booking 
        const newBooking = await Booking.create({
            spotId: parseInt(spotId),
            userId: req.user.id,
            startDate,
            endDate
        });

        res.status(200).json(newBooking);

    } catch (err) {
        next(err);
    }


})



module.exports = router;
