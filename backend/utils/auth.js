// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Booking, Spot, Review } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

// Restore User
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// Require Auth (NOT IN USE)
// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

// // IF THE USER IS NOT AUTHORIZED, THROW AN ERROR
// const authorize = async function (req, _res, next) {
//     const userId = req.user.id;

//     if (req.params.spotId) {
//         const spot = await Spot.findByPk(req.params.spotId);
//         if (!spot || spot.ownerId !== userId) {
//             const err = new Error('Spot not found or you are not the owner');
//             err.status = 403;
//             return next(err);
//         } else if (spot) {
//             if (spot.ownerId === userId) {
//                 return next();
//             }
//         }
//     }

//     if (req.params.reviewId) {
//         const review = await Review.findByPk(req.params.reviewId);
//         if (!review || review.userId !== userId) {
//             const err = new Error('Review not found or you are not the owner');
//             err.status = 403;
//             return next(err);
//         }
//     }

//     if (req.params.bookingId) {
//         const booking = await Booking.findByPk(req.params.bookingId);
//         if (!booking || booking.userId !== userId) {
//             const err = new Error('Booking not found or you are not the owner');
//             err.status = 403;
//             return next(err);
//         } else if (booking) {
//             if (booking.userId === userId) {
//                 return next();
//             }
//         }
//     }

//     // No matching condition, return Forbidden error
//     const err = new Error('Forbidden');
//     err.status = 403;
//     return next(err);
// }

module.exports = { setTokenCookie, restoreUser, requireAuth };
