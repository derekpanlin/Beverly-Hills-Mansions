const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check, validationResult } = require('express-validator');

// GET ALL OF THE CURRENT USER'S BOOKINGS
// GET /api/bookings/current

router.get('/current', requireAuth, async (req, res) => {
    const user = req.user

    const validUser = await User.findByPk(user.id)

    let bookings = await validUser.getBookings({
        include: [
            {
                model: Spot,
                include: [{
                    model: SpotImage
                }]
            }
        ]
    })

    let userBookings = [];

    bookings.forEach(booking => {
        const jsonBooking = booking.toJSON()



        console.log(jsonBooking)

        // get previewImage
        jsonBooking.Spot.SpotImages.forEach((image) => {
            if (image.preview) {
                jsonBooking.Spot.previewImage = image.url;
            }
        });
        if (!jsonBooking.Spot.previewImage) jsonBooking.Spot.previewImage = "no preview image found";
        delete jsonBooking.Spot.SpotImages;

        delete jsonBooking.Spot.description
        delete jsonBooking.Spot.createdAt
        delete jsonBooking.Spot.updatedAt

        // set number types for lat, lng, and price
        jsonBooking.Spot.lat = Number(jsonBooking.Spot.lat);
        jsonBooking.Spot.lng = Number(jsonBooking.Spot.lng);
        jsonBooking.Spot.price = Number(jsonBooking.Spot.price);
        userBookings.push(jsonBooking)
    });

    res.json({
        Bookings: userBookings
    })
});

module.exports = router;
