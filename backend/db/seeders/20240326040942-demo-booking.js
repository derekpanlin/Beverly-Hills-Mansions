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
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 1,
        spotId: 3,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 1,
        spotId: 4,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 1,
        spotId: 6,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 2,
        spotId: 1,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 2,
        spotId: 5,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 2,
        spotId: 6,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 3,
        spotId: 1,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 3,
        spotId: 2,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        userId: 3,
        spotId: 4,
        startDate: new Date(),
        endDate: new Date()
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
