const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors, validateStartDate, validateEndDate } = require('../../utils/validation')
const { check, validationResult } = require('express-validator');

const validateSpot = [
    check("address")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check("city")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check("state")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check("lat")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be within -90 and 90"),
    check("lng")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be within -180 and 180"),
    check("name")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Name is required"),
    check("name")
        .exists({ checkFalsy: false })
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),
    check("price")
        .exists({ checkFalsy: true })
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("Price per day must be a positive number"),
    handleValidationErrors,
];

// Custom validation for validating review data
const validateReview = [
    check('review').notEmpty().withMessage('Review text is required'),
    check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors,
];

const validateBooking = [
    check('startDate').custom(async (startDate, { req }) => {
        const currentDate = new Date();
        if (new Date(startDate) < currentDate) {
            throw new Error('startDate cannot be in the past');
        }

        const existingBooking = await Booking.findOne({
            where: {
                spotId: parseInt(req.params.spotId),
                [Op.or]: [
                    { startDate: { [Op.eq]: startDate } }, // Check if startDate matches an existing booking's startDate
                    { endDate: { [Op.eq]: startDate } },   // Check if startDate matches an existing booking's endDate
                    { startDate: { [Op.lt]: startDate }, endDate: { [Op.gt]: startDate } } // Check if startDate falls within an existing booking's startDate and endDate
                ]
            }
        });

        if (existingBooking) {
            throw new Error('Start date conflicts with an existing booking');
        }

    }),
    check('endDate').custom(async (endDate, { req }) => {
        if (new Date(endDate) <= new Date(req.body.startDate)) {
            throw new Error('endDate cannot be on or before startDate');
        }

        const existingBooking = await Booking.findOne({
            where: {
                spotId: parseInt(req.params.spotId),
                [Op.or]: [
                    { startDate: { [Op.eq]: endDate } }, // Check if endDate matches an existing booking's startDate
                    { endDate: { [Op.eq]: endDate } },   // Check if endDate matches an existing booking's endDate
                    { startDate: { [Op.lt]: endDate }, endDate: { [Op.gt]: endDate } } // Check if endDate falls within an existing booking's startDate and endDate
                ]
            }
        });

        if (existingBooking) {
            throw new Error('End date conflicts with an existing booking');
        }

    }),
    handleValidationErrors
];

const validateQuery = [

]
// GET All spots --> /api/spots

router.get('/', async (req, res, next) => {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    // Parse query parameters and build a filter object
    const filter = {};
    if (minLat !== undefined && maxLat !== undefined) {
        filter.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
    }

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

router.post('/', requireAuth, validateSpot, async (req, res, next) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
    newSpot.lat = Number(newSpot.lat);
    newSpot.lng = Number(newSpot.lng);
    newSpot.price = Number(newSpot.price);

    const formattedSpot = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt,
    }
    res.status(201).json(formattedSpot);

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

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
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

        // Create a new object with the desired structure and order of properties
        const formattedBody = {
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
        };

        // Send the response with the new object
        res.status(200).json(formattedBody);

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

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
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

        const formattedBody = {
            id: newReview.id,
            userId: newReview.userId,
            spotId: newReview.spotId,
            review: newReview.review,
            stars: newReview.stars,
            createdAt: newReview.createdAt,
            updatedAt: newReview.updatedAt
        }

        res.status(201).json(formattedBody);


    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = {};
            err.errors.forEach(error => {
                errors[error.path] = error.message;
            });

            // Add the review validation error if it exists
            if (!errors.hasOwnProperty('review') && !req.body.review) {
                errors.review = 'Review text is required';
            }

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

router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
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


        const startDateConflict = await Booking.findOne({
            where: {
                spotId,
                startDate: { [Op.eq]: startDate }
            }
        });
        if (startDateConflict) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking"
                }
            });
        }

        // Create the booking 
        const newBooking = await Booking.create({
            spotId: parseInt(spotId),
            userId: req.user.id,
            startDate: new Date(startDate), // Format the startDate
            endDate: new Date(endDate) // Format the endDate
        });

        const formattedBody = {
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate.toISOString().split('T')[0],
            endDate: newBooking.endDate.toISOString().split('T')[0],
            createdAt: newBooking.createdAt,
            updatedAt: newBooking.updatedAt,
        }

        res.status(200).json(formattedBody);

    } catch (err) {
        next(err);
    }


})



module.exports = router;
