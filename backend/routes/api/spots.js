const express = require('express');
const router = express.Router();

const { Spot, User, Booking, Review, ReviewImage } = require('../../db/models');

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
        });

        res.status(200).json({ Spots: spots })
    } catch (err) {
        next(err)
    }
})

// Get all Spots owned/created by the current user
// GET /api/spots/current

router.get('/current', async (req, res, next) => {

})



module.exports = router;
