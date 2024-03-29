'use strict';

const { query } = require('express');
const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.validate = true;
options.tableName = 'Reviews';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 5,
        review: 'Amazing place!',
        stars: 5
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Meh. Gross.',
        stars: 1
      },
      {
        userId: 1,
        spotId: 4,
        review: 'We loved it!',
        stars: 5
      },
      {
        userId: 1,
        spotId: 6,
        review: 'Seriously disgusting. There was mold!',
        stars: 1
      },
      {
        userId: 2,
        spotId: 1,
        review: 'Could be better...',
        stars: 2
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Amazing! We will be back!',
        stars: 5
      },
      {
        userId: 2,
        spotId: 5,
        review: 'Simply amazing!!!',
        stars: 5
      },
      {
        userId: 2,
        spotId: 6,
        review: 'WE ARE NEVER COMING BACK!',
        stars: 1
      },
      {
        userId: 3,
        spotId: 1,
        review: 'I will not stay here.',
        stars: 1
      },
      {
        userId: 3,
        spotId: 2,
        review: 'I stayed here.',
        stars: 3
      },
      {
        userId: 3,
        spotId: 4,
        review: 'Would stay again.',
        stars: 5
      }
    ])
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options, null, {})

  }
};
