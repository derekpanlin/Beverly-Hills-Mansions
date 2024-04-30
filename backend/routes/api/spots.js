const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');

const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors, validateStartDate, validateEndDate } = require('../../utils/validation')
const { check, validationResult } = require('express-validator');

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Name is required"),
  check("name")
    .exists({ checkFalsy: false })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Price per day must be a positive number greater than 1"),

  handleValidationErrors,
];

// Custom validation for validating review data
const validateReview = [
  check('review').notEmpty().withMessage('Review text is required'),
  check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),

  handleValidationErrors,
];


const validateQuery = [
  check('page')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Page must be an integer between 1 and 10'),

  check('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Size must be an integer between 1 and 20'),

  check('minLat')
    .optional()
    .isDecimal()
    .withMessage('Minimum latitude must be a valid decimal number'),
  check('maxLat')
    .optional()
    .isDecimal()
    .withMessage('Maximum latitude must be a valid decimal number'),

  check('minLng')
    .optional()
    .isDecimal()
    .withMessage('Minimum longitude must be a valid decimal number'),
  check('maxLng')
    .optional()
    .isDecimal()
    .withMessage('Maximum longitude must be a valid decimal number'),

  check('minPrice')
    .optional()
    .isDecimal({ min: 0 })
    .withMessage('Minimum price must be a decimal greater than or equal to 0'),
  check('maxPrice')
    .optional()
    .isDecimal({ min: 0 })
    .withMessage('Maximum price must be a decimal greater than or equal to 0'),

  handleValidationErrors
]

// GET All spots --> /api/spots

router.get('/', validateQuery, async (req, res, _next) => {
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  let { page, size } = req.query;

  console.log(minLat, maxLat, minLng, maxLng, minPrice, maxPrice);


  page = parseInt(page) || 1;
  size = parseInt(size) || 20;
  console.log(page, size);
  // Parse query parameters and build a filter object
  const filter = {};


  if (minLat !== undefined && maxLat !== undefined) {
    filter.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
  }
  if (minLng !== undefined && maxLng !== undefined) {
    filter.lng = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] };
  }
  if (minPrice !== undefined && maxPrice !== undefined) {
    filter.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
  }

  // Fetch all spots from db
  const spots = await Spot.findAll({
    attributes: [
      'id',
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
      'updatedAt'
    ],
    where: filter,
    include: [
      {
        model: Review,
        attributes: ['stars'],
        required: false
      },
      {
        model: SpotImage,
        where: { preview: true },
        attributes: ['url'],
        required: false
      }
    ],
    limit: size,
    offset: (page - 1) * size
  });

  // Calculate average rating for each spot
  const formattedSpots = spots.map(spot => {
    const numReviews = spot.Reviews.length;
    const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, cur) => acc + cur.stars, 0) / numReviews : 0;

    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgStarRating,
      previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null
    };
  });

  res.status(200).json({ Spots: formattedSpots, page: parseInt(page), size: parseInt(size) });

});


// Get all Spots owned/created by the current user
// GET /api/spots/current

router.get('/current', requireAuth, async (req, res, next) => {
  try {
    // Fetch all spots from db
    const spots = await Spot.findAll({
      where: {
        ownerId: req.user.id
      },
      attributes: [
        'id',
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
        'updatedAt'
      ],
      include: [
        {
          model: Review,
          attributes: ['stars'],
          required: false
        },
        {
          model: SpotImage,
          where: { preview: true },
          attributes: ['url'],
          required: false
        }
      ],

    });

    // Calculate average rating for each spot
    const formattedSpots = spots.map(spot => {
      const numReviews = spot.Reviews.length;
      const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, cur) => acc + cur.stars, 0) / numReviews : 0;

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: avgStarRating,
        previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null
      };
    });

    res.status(200).json({ Spots: formattedSpots });
  } catch (err) {
    next(err);
  }
})

// GET DETAILS OF A SPOT FROM AN ID
// GET /api/spots/:spotId

router.get('/:spotId', async (req, res, next) => {
  try {
    // Extract spotId from params
    const { spotId } = req.params;

    // Get spot from an id
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Review,
          attributes: ['id', 'stars']
        }
      ]
    });

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    // calculate average star rating
    const numReviews = spot.Reviews.length;
    const avgStarRating = numReviews > 0 ? spot.Reviews.reduce((acc, cur) => acc + cur.stars, 0) / numReviews : 0;

    res.status(200).json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: numReviews,
      avgStarRating: avgStarRating,
      SpotImages: spot.SpotImages,
      Owner: spot.User
    });

  } catch (err) {
    next(err);
  }
});

// CREATE A SPOT
// POST /api/spots

router.post('/', requireAuth, validateSpot, async (req, res, next) => {

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });
  newSpot.lat = Number(newSpot.lat);
  newSpot.lng = Number(newSpot.lng);
  newSpot.price = Number(newSpot.price);

  const formattedSpot = {
    id: newSpot.id,
    ownerId: newSpot.ownerId,
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
    createdAt: newSpot.createdAt,
    updatedAt: newSpot.updatedAt,
  }
  res.status(201).json(formattedSpot);

})

// ADD AN IMAGE TO A SPOT BASED ON THE SPOT'S ID
// POST /api/spots/:spotId/images

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Spot doesn't belong to the current user"
      });
    }

    // Creating a new image for the spot
    const newImage = await SpotImage.create({ url, preview, spotId });

    res.status(200).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    });

  } catch (err) {
    next(err)
  }

});

// EDIT A SPOT
// PUT /api/spots/:spotId

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const { spotId } = req.params;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);

    // Check if spot exists
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" })
    }

    // Check if spot belongs to the current user
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Spot doesn't belong to current user"
      })
    }

    // Update the spot with the new data
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    // Save updated spot
    await spot.save();

    // Create a new object with the desired structure and order of properties
    const formattedBody = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt
    };

    // Send the response with the new object
    res.status(200).json(formattedBody);

  } catch (err) {
    next(err);
  }

})

// DELETE A SPOT
// DELETE /api/spots/:spotId

router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found"
    })
  };

  // Check if spot belongs to the current user
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Unauthorized: Spot doesn't belong to current user"
    })
  }

  await spot.destroy();

  res.status(200).json({
    message: "Successfully deleted"
  })



})

// Get all reviews by a spot's ID
// GET /api/spots/:spotId/reviews

router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  try {
    // Find spot by id
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    // Find all reviews for that spot
    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: ReviewImage, attributes: ['id', 'url'] }
      ]
    });

    if (!reviews.length) {
      return res.status(404).json({
        message: "Spot has no reviews"
      });
    } else {
      return res.status(200).json({ Reviews: reviews })
    }
  } catch (err) {
    next(err);
  }
});

// Create a review for a spot based on the spot's id
// POST /api/spots/:spotId/reviews

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;

  try {
    // Check if spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" })
    }

    // Check if current user already has a review for the spot
    const existingReview = await Review.findOne({
      where: { spotId, userId: req.user.id }
    });

    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" })
    };

    // Create review
    const newReview = await Review.create({
      userId: req.user.id,
      spotId,
      review,
      stars
    });

    const formattedBody = {
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt
    }

    res.status(201).json(formattedBody);


  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = {};
      err.errors.forEach(error => {
        errors[error.path] = error.message;
      });

      // Add the review validation error if it exists
      if (!errors.hasOwnProperty('review') && !req.body.review) {
        errors.review = 'Review text is required';
      }

      return res.status(400).json({ message: 'Bad Request', errors });
    }
    next(err);

  }
});

// GET ALL BOOKINGS FOR A SPOT BASED ON SPOT'S ID
// GET /api/spots/:spotId/bookings

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    // console.log(spot)

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
    }

    // Fetch bookings for the spot
    let bookings = await Booking.findAll({
      where: { spotId },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    })

    // If current user is owner, include user details in body
    if (req.user.id === spot.ownerId) {
      res.json({
        Bookings: bookings.map(booking => ({
          User: {
            id: booking.User.id,
            firstName: booking.User.firstName,
            lastName: booking.User.lastName
          },
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate.toISOString().split('T')[0],
          endDate: booking.endDate.toISOString().split('T')[0],
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        }))
      });
    } else {
      // If current user isn't owner, just show the bookings
      bookings = bookings.map(booking => {
        return {
          spotId: booking.spotId,
          startDate: booking.startDate.toISOString().split('T')[0],
          endDate: booking.endDate.toISOString().split('T')[0]
        };
      });
      res.json({ Bookings: bookings })
    }
  } catch (err) {
    next(err)
  }
})

// SPECIFIC VALIDATIONS FOR BOOKING

const validateBookingDatesExist = [
  check('startDate')
    .exists({ checkFalsey: true })
    .notEmpty()
    .withMessage("Start date is required"),
  check('endDate')
    .exists({ checkFalsey: true })
    .notEmpty()
    .withMessage("End date is required"),
  handleValidationErrors
]

const validateBooking = [
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

// CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID
// POST /api/spots/:spotId/bookings

router.post('/:spotId/bookings', requireAuth, validateBookingDatesExist, validateBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.toJSON().id;
  const foundSpot = await Spot.findByPk(spotId);

  if (!foundSpot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (userId === foundSpot.toJSON().ownerId) {
    return res.status(403).json({ message: "Forbidden: Spot must NOT belong to the current user" })
  };

  // Validate the dates and check for conflicts 
  let { startDate, endDate } = req.body;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const existingBookings = await Booking.findAll({ where: { spotId: spotId } });
  for (const booking of existingBookings) {
    const bookingStartDate = new Date(booking.startDate);
    const bookingEndDate = new Date(booking.endDate);
    // First throw error for startDate conflict
    if (startDate >= bookingStartDate && startDate <= bookingEndDate && endDate > bookingEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking"
        }
      });
      // Else throw the endDate error
    } else if (endDate >= bookingStartDate && endDate <= bookingEndDate && startDate < bookingStartDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking"
        }
      });
      // Conflict with both startDate and endDate surrounding 
    } else if ((startDate <= bookingStartDate && endDate >= bookingEndDate) || (startDate >= bookingStartDate && endDate <= bookingEndDate)) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        }
      });
    }
  }


  //  If no conflict, create the booking
  const newBooking = await Booking.create({
    spotId: parseInt(spotId),
    userId: req.user.id,
    startDate: new Date(startDate), // Format the startDate
    endDate: new Date(endDate) // Format the endDate
  });

  const formattedBody = {
    id: newBooking.id,
    spotId: newBooking.spotId,
    userId: newBooking.userId,
    startDate: newBooking.startDate.toISOString().split('T')[0],
    endDate: newBooking.endDate.toISOString().split('T')[0],
    createdAt: newBooking.createdAt,
    updatedAt: newBooking.updatedAt,
  }

  res.status(200).json(formattedBody);
})


module.exports = router;
