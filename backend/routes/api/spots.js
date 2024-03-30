const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotData } = require('../../utils/validation')

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

        const newImage = await SpotImage.create({ url, preview, spotId });

        res.status(200).json(newImage);
    } catch (err) {
        next(err)
    }

});

// EDIT A SPOT
// PUT /api/spots/:spotId


// DELETE A SPOT
// DELETE /api/spots/:spotId





module.exports = router;
