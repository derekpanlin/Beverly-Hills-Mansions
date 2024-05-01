const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors, handleValidationErrors403 } = require('../../utils/validation');
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
        .isAfter(new Date().toString())
        .withMessage("startDate cannot be in the past"),
    check('endDate')
        .exists({ checkFalsey: true })
        .notEmpty()
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('endDate cannot be on or before startDate')
            }
            return true
        }),
    check('endDate')
        .isAfter(new Date().toString())
        .withMessage("endDate cannot be in the past"),
    handleValidationErrors
]
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

router.put('/:bookingId', requireAuth, validateBookingDatesExist, validateBookingEdit, async (req, res, next) => {

    const { bookingId } = req.params

    // Error if booking can't be found
    let foundBooking = await Booking.findByPk(bookingId)
    // console.log(`This is the foundBooking ${foundBooking.toJSON()}`)
    if (!foundBooking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    // Error if modifying past booking
    if (foundBooking.toJSON().endDate <= new Date()) {
        return res.status(403).json({ message: "Past bookings can't be modified" })
    }

    // Error if booking doesn't belong to current user
    if (foundBooking.userId !== req.user.id) {
        return res.status(403).json({ message: "Current user is not authorized to edit this booking" })
    }

    const spotId = foundBooking.spotId

    // Extract startDate and endDate from req body
    let { startDate, endDate } = req.body

    // Format the start and endDate
    startDate = new Date(startDate);
    endDate = new Date(endDate);


    const existingBookings = await Booking.findAll({
        where: {
            spotId: spotId,
            id: { [Op.not]: bookingId }
        }
    });

    for (const booking of existingBookings) {
        console.log(booking.toJSON())
        const bookingStartDate = new Date(booking.startDate);
        const bookingEndDate = new Date(booking.endDate);

        // Format the dates as strings in "YYYY-MM-DD" format
        const bookingStartDateString = bookingStartDate.toISOString().split('T')[0];
        const bookingEndDateString = bookingEndDate.toISOString().split('T')[0];
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];

        // First throw error for startDate conflict
        console.log(`This is the req body startDate: ${startDateString} and booking StartDate ${bookingStartDateString}`);
        console.log(`This is the req body endDate: ${endDateString} and booking endDate ${bookingEndDateString}`);

        if (startDateString >= bookingStartDateString && startDateString <= bookingEndDateString && endDateString > bookingEndDateString) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking"
                }
            });
            // Else throw the endDate error
        }
        if (endDateString >= bookingStartDateString && endDateString <= bookingEndDateString && startDateString < bookingStartDateString) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    endDate: "End date conflicts with an existing booking"
                }
            });
            // Conflict with both startDate and endDate surrounding
        }
        if ((startDateString <= bookingStartDateString && endDateString >= bookingEndDateString) || (startDateString >= bookingStartDateString && endDateString <= bookingEndDateString)) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                }
            });
        }


        await foundBooking.update({ startDate, endDate }); //previously had req.body
        // console.log(req.body);

        // Format the response
        const formattedBooking = {
            id: foundBooking.id,
            userId: foundBooking.userId,
            spotId: foundBooking.spotId,
            startDate: foundBooking.startDate.toISOString().split('T')[0],
            endDate: foundBooking.endDate.toISOString().split('T')[0],
            createdAt: foundBooking.createdAt,
            updatedAt: foundBooking.updatedAt
        };

        res.json(formattedBooking);

        // console.log(`${startDate} and ${endDate}`)\
    }

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
        message: 'Successfully deleted',
    });
});


module.exports = router;
