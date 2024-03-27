const express = require('express');
const router = express.Router();

const { Spot, User, Booking, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
// GET All spots
// GET /api/spots

router.get('/', async (req, res, next) => {
    try {
        // Fetch all spots from db
        const spots = await Spot.findAll({
            attributes: ['id',
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
                'updatedAt']
            // [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']] <-- aggregate to calculate avgRating
            // must add previewImage too
        });

        res.status(200).json({ Spots: spots })
    } catch (err) {
        next(err);
    }
})

// Get all Spots owned/created by the current user
// GET /api/spots/current

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            where: {
                ownerId: req.user.id
            }
        });

        res.status(200).json({ Spots: spots })
    } catch (err) {
        next(err);
    }
})



module.exports = router;
