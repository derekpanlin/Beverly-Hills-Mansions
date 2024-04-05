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
        name: 'Owner 1 Home(1)',
        description: 'My childhood home growing up.',
        price: 1000.00
      },
      {
        ownerId: 1,
        address: '6 Bull Sun',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 100.96235,
        lng: 305.26534,
        name: 'Owner 1 Home(2)',
        description: 'Our overly expensive apartment that we love.',
        price: 1100.00
      },
      {
        ownerId: 2,
        address: '17207 Angel',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 200.96235,
        lng: 75.26534,
        name: 'Owner 2 Home(1)',
        description: 'Our overly expensive apartment that we love.',
        price: 2000.00
      },
      {
        ownerId: 2,
        address: '17206 Ansel',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 37.96235,
        lng: 50.26534,
        name: 'Owner 2 Home(2)',
        description: 'Our overly expensive apartment that we love.',
        price: 2100.00
      },
      {
        ownerId: 3,
        address: '17206 Louis Ave',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 10.96235,
        lng: 30.26534,
        name: 'Louis Home',
        description: 'Louis the doodles home',
        price: 5000.00
      },
      {
        ownerId: 3,
        address: '1000 Louis Blvd',
        city: 'Irvine',
        state: 'CA',
        country: 'USA',
        lat: 10.96235,
        lng: 30.26534,
        name: 'Louis Home(2)',
        description: 'Louis the doodles second home.',
        price: 5000.00
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {})

  }
};
