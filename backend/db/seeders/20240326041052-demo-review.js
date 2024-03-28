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
        userId: 2,
        spotId: 1,
        review: 'Could be better...',
        stars: 2
      },
      {
        userId: 3,
        spotId: 2,
        review: 'I stayed here.',
        stars: 3
      }
    ])
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options, null, {})

  }
};
