'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.validate = true;
options.tableName = 'Bookings';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId: 1,
        spotId: 5,
        startDate: "2024-05-01",
        endDate: "2024-05-02"
      },
      {
        userId: 1,
        spotId: 3,
        startDate: "2024-01-03",
        endDate: "2024-01-04"
      },
      {
        userId: 1,
        spotId: 4,
        startDate: "2024-01-05",
        endDate: "2024-01-06"
      },
      {
        userId: 1,
        spotId: 6,
        startDate: "2024-01-07",
        endDate: "2024-01-08"
      },
      {
        userId: 2,
        spotId: 1,
        startDate: "2024-05-01",
        endDate: "2024-05-02"
      },
      {
        userId: 2,
        spotId: 2,
        startDate: "2024-01-03",
        endDate: "2024-01-04"
      },
      {
        userId: 2,
        spotId: 5,
        startDate: "2024-01-05",
        endDate: "2024-01-06"
      },
      {
        userId: 2,
        spotId: 6,
        startDate: "2024-01-09",
        endDate: "2024-01-10"
      },
      {
        userId: 3,
        spotId: 1,
        startDate: "2024-01-03",
        endDate: "2024-01-04"
      },
      {
        userId: 3,
        spotId: 2,
        startDate: "2024-05-01",
        endDate: "2024-05-03"
      },
      {
        userId: 3,
        spotId: 4,
        startDate: "2024-01-07",
        endDate: "2024-01-08"
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {

    options.truncate = true;
    options.cascade = true;
    options.restartIdentity = true;

    await queryInterface.bulkDelete(options, null, {})

  }
};
