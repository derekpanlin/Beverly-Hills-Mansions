// backend/utils/validation.js

const { validationResult, check } = require('express-validator');
const { Op } = require('sequelize');
const Booking = require('../db/models/booking')

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

// Custom validation for startDate
const validateStartDate = check('startDate')
    .custom(async (value, { req }) => {
        // Create a variable to store current date
        const currentDate = new Date();
        // Compare if new value is before currentDate
        if (new Date(value) < currentDate) {
            throw new Error('startDate cannot be in the past');
        }

        // Find existing booking
        const existingBooking = await Booking.findOne({
            where: {
                spotId: req.params.spotId,
                [Op.or]: [
                    // Check if req.body.startDate (value) is between an existing bookings startDate and endDate
                    { startDate: { [Op.lte]: value }, endDate: { [Op.gte]: value } },
                    // Check if booking startDate is less than/equal to value, and booking endDate greater than/equal to req.body.endDate
                    { startDate: { [Op.lte]: value }, endDate: { [Op.gte]: req.body.endDate } },
                    // Check if provided startDate is after/equal to existing booking startDate, and if existing endDate is before req endDate
                    { startDate: { [Op.gte]: value }, endDate: { [Op.lte]: req.body.endDate } },
                    // Check if existing startDate is before the req end date, and the existing endDate is after req endDate
                    { startDate: { [Op.lte]: req.body.endDate }, endDate: { [Op.gte]: req.body.endDate } }
                ]
            }
        })
        if (existingBooking) {
            throw new Error('Start date conflicts with an existing booking')
        }
        return true;
    })

// Custom validation for endDate
const validateEndDate = check('endDate')
    .custom(async (value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            throw new Error('endDate cannot be on or before startDate');
        }
        const existingBooking = await Booking.findOne({
            where: {
                spotId: req.params.spotId,
                [Op.or]: [
                    // Check if req endDate is between booking start and endDate
                    { startDate: { [Op.lte]: value }, endDate: { [Op.gte]: value } },
                    // Check if req endDate 
                    { startDate: { [Op.lte]: value }, endDate: { [Op.gte]: req.body.startDate } },
                    { startDate: { [Op.gte]: value }, endDate: { [Op.lte]: req.body.startDate } },
                    { startDate: { [Op.lte]: req.body.startDate }, endDate: { [Op.gte]: req.body.startDate } }
                ]
            }
        });
        if (existingBooking) {
            throw new Error('End date conflicts with an existing booking');
        }
        return true;
    });
module.exports = {
    handleValidationErrors,
    validateStartDate,
    validateEndDate
};
