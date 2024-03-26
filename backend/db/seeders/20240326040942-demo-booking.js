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
        spotId: 2,
        startDate: new Date(),
        endDate: new Date()
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
