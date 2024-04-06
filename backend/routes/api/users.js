// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('First Name is required.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Last Name is required.'),
    handleValidationErrors
];

// POST /api/users

router.post('/',
    validateSignup,
    async (req, res) => {
        const { email, firstName, lastName, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const findUsername = await User.findOne({
            where: { username: username }

        });
        const findEmail = await User.findOne({
            where: { email: email }
        })

        if (findUsername) {
            return res.status(500).json({
                message: "User already exists",
                errors: {
                    username: "User with that username already exists"
                }
            })
        } else if (findEmail) {
            return res.status(500).json({
                message: "User already exists",
                errors: {
                    email: "User with that email already exists"
                }
            })
        };





        const user = await User.create({ email, firstName, lastName, username, hashedPassword });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };


        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        })

    })
module.exports = router;
