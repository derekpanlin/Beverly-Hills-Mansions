// backend/utils/validation.js

const { validationResult } = require('express-validator');

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

// Custom validation for validating spot data
function validateSpotData(req, res, next) {
    const errors = {};

    // Check if required fields are present
    if (!req.body.address) {
        errors.address = "Street address is required";
    }
    if (!req.body.city) {
        errors.city = "City is required";
    }
    if (!req.body.state) {
        errors.state = "State is required";
    }
    if (!req.body.country) {
        errors.country = "Country is required";
    }
    if (!req.body.lat || req.body.lat < -90 || req.body.lat > 90) {
        errors.lat = "Latitude must be within -90 and 90";
    }
    if (!req.body.lng || req.body.lng < -180 || req.body.lng > 180) {
        errors.lng = "Longitude must be within -180 and 180";
    }
    if (!req.body.name || req.body.name.length >= 50) {
        errors.name = "Name must be less than 50 characters";
    }
    if (!req.body.description) {
        errors.description = "Description is required";
    }
    if (!req.body.price || req.body.price <= 0) {
        errors.price = "Price per day must be a positive number";
    }

    // If there are errors, respond with 400 and the error object
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

    // If validation passes, move to the next middleware
    next();
}

module.exports = {
    handleValidationErrors,
    validateSpotData
};
