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

const handleValidationErrors403 = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 403;
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
            const error = new Error('startDate cannot be in the past');
            error.status = 400;
            error.errors = { startDate: 'startDate cannot be in the past' };
            throw error;
        }

        // Find existing booking
        const existingBooking = await Booking.findOne({
            where: {
                spotId: req.params.spotId,
                [Op.or]: [
                    // Check if req.startDate is within an existing booking's startDate and endDate
                    { startDate: { [Op.lte]: value }, endDate: { [Op.gte]: value } },
                    // Check if req.startDate is on an existing startDate
                    { startDate: value },
                    // Check if req.startDate is on an existing endDate
                    { endDate: value },
                    // Check if req.startDate is during an existing booking’s startDate and endDate
                    { startDate: { [Op.lt]: value }, endDate: { [Op.gt]: value } }
                ]
            }
        });
        if (existingBooking) {
            const error = new Error('Start date conflicts with an existing booking');
            error.status = 400;
            error.errors = { startDate: 'Start date conflicts with an existing booking' };
            throw error;
        }
        return true;
    })

// Custom validation for endDate
const validateEndDate = check('endDate')
    .custom(async (value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            const error = new Error('endDate cannot be on or before startDate');
            error.status = 400;
            error.errors = { endDate: 'endDate cannot be on or before startDate' }
            throw error;
        }
        // Find existing booking
        const existingBooking = await Booking.findOne({
            where: {
                spotId: req.params.spotId,
                [Op.or]: [
                    // Check if req.endDate is within an existing booking's startDate and endDate
                    { startDate: { [Op.lte]: value }, endDate: { [Op.gte]: value } },
                    // Check if req.endDate is on an existing startDate
                    { startDate: value },
                    // Check if req.endDate is on an existing endDate
                    { endDate: value },
                    // Check if req.endDate is during an existing booking’s startDate and endDate
                    { startDate: { [Op.lt]: value }, endDate: { [Op.gt]: value } }
                ]
            }
        });
        if (existingBooking) {
            const error = new Error('End date conflicts with an existing booking');
            error.status = 400;
            error.errors = { endDate: 'End date conflicts with an existing booking' };
            throw error;
        }
        return true;
    });

module.exports = {
    handleValidationErrors,
    handleValidationErrors403,
    validateStartDate,
    validateEndDate
};
