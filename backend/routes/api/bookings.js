const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, authorize } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check, validationResult } = require('express-validator');

const validateBookingDatesExist = [
    check('startDate')
        .optional()
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("Start date cannot be empty"),
    check('endDate')
        .optional()
        .exists({ checkFalsey: true })
        .notEmpty()
        .withMessage("End date cannot be empty"),
    handleValidationErrors
];

const validateBookingEdit = [
    check('startDate')
        .optional()
        .isAfter(new Date().toString())
        .withMessage("startDate cannot be in the past"),
    check('endDate')
        .optional()
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('endDate cannot be on or before startDate')
            }
            return true
        }),
    handleValidationErrors
];
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

        // get previewImage
        jsonBooking.Spot.SpotImages.forEach((image) => {
            if (image.preview) {
                jsonBooking.Spot.previewImage = image.url;
            }
        });

        if (!jsonBooking.Spot.previewImage) jsonBooking.Spot.previewImage = "No preview image found";
        // Delete queries not included in body
        delete jsonBooking.Spot.SpotImages;
        delete jsonBooking.Spot.description
        delete jsonBooking.Spot.createdAt
        delete jsonBooking.Spot.updatedAt

        // Format the jsonBooking's startDate and endDate 
        jsonBooking.startDate = new Date(jsonBooking.startDate).toISOString().split('T')[0];
        jsonBooking.endDate = new Date(jsonBooking.endDate).toISOString().split('T')[0];

        // Set number types for lat, lng, and price
        jsonBooking.Spot.lat = Number(jsonBooking.Spot.lat);
        jsonBooking.Spot.lng = Number(jsonBooking.Spot.lng);
        jsonBooking.Spot.price = Number(jsonBooking.Spot.price);
        userBookings.push(jsonBooking);
    });

    res.json({
        Bookings: userBookings
    })
});

// EDIT A BOOKING
// PUT /api/bookings/:bookingId

router.put('/:bookingId', requireAuth, authorize, validateBookingDatesExist, validateBookingEdit, async (req, res, next) => {

    const { bookingId } = req.params

    let foundBooking = await Booking.findByPk(bookingId)
    if (!foundBooking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    if (foundBooking.toJSON().endDate <= new Date()) {
        return res.status(403).json({ message: "Past bookings can't be modified" })
    }

    const spotId = foundBooking.spotId

    let bookings = await Booking.findAll({ where: { spotId: spotId } })

    // declare startDates as date objects
    let { startDate, endDate } = req.body

    startDate = new Date(startDate)
    endDate = new Date(endDate)

    const err = new Error("Sorry, this spot is already booked for the specified dates")
    err.status = 403
    err.errors = {}

    // handle conflicts with existing bookings
    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i]

        if (booking.id == bookingId) {
            continue;
        }

        let existingStartDate = new Date(booking.startDate)
        let existingEndDate = new Date(booking.endDate)

        // conflicting start date
        if (startDate >= existingStartDate && startDate <= existingEndDate) {
            err.errors.startDate = "Start date conflicts with an existing booking"
        }

        // conflicting end date
        if (endDate >= existingStartDate && endDate <= existingEndDate) {
            err.errors.endDate = "End date conflicts with an existing booking"
        }

        // booking spans an existing booking
        if (startDate <= existingStartDate && endDate >= existingEndDate) {
            err.errors = {}
            err.errors.startDate = "Start date conflicts with an existing booking"
            err.errors.endDate = "End date conflicts with an existing booking"
        }
    }

    if (Object.keys(err.errors).length) return next(err)

    await foundBooking.update(req.body)

    res.json(foundBooking)
})

// DELETE A BOOKING
// DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingIdParam = req.params.bookingId;
    const bookingId = parseInt(bookingIdParam);
    const userId = req.user.id;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
        });
    }
    const currDate = new Date();
    const parseStart = new Date(booking.startDate);
    const parseEnd = new Date(booking.endDate);

    const spot = await Spot.findByPk(booking.spotId);
    const isSpotOwner = spot.ownerId === userId;
    const isBookingOwner = booking.userId === userId;
    if (currDate >= parseStart && currDate <= parseEnd) {
        return res.status(400).json({
            message: "Bookings that have been started can't be deleted",
        });
    } else if (currDate >= parseEnd) {
        return res.status(400).json({
            message: "Bookings in the past can't be deleted",
        });
    } else if (!isBookingOwner && !isSpotOwner) {
        return res.status(403).json({
            message: 'Authorization required: Not an Owner of the spot or the User on the Booking',
        });
    }
    await booking.destroy();
    res.status(200).json({
        message: 'Successful deletion',
    });
});


module.exports = router;
