'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.validate = true;
options.tableName = 'Spots';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '4 Bull Run',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 50.96235,
        lng: 49.26534,
        name: 'Childhood Home',
        description: 'My childhood home growing up.',
        price: 100.00
      },
      {
        ownerId: 2,
        address: '17206 Ansel',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 100.96235,
        lng: 305.26534,
        name: 'Our Home',
        description: 'Our overly expensive apartment that we love.',
        price: 2000.00
      }
    ], options)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
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
