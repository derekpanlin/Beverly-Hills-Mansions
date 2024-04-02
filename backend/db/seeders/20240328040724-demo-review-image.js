'use strict';


const { query } = require('express');
const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.validate = true;
options.tableName = 'ReviewImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        url: 'review image url 1',
        reviewId: 1
      },
      {
        url: 'review image url 2',
        reviewId: 2
      },
      {
        url: 'review image url 3',
        reviewId: 3
      },
      {
        url: 'review image url 3',
        reviewId: 4
      },
      {
        url: 'review image url 3',
        reviewId: 5
      },
      {
        url: 'review image url 3',
        reviewId: 6
      },
      {
        url: 'review image url 3',
        reviewId: 7
      },
      {
        url: 'review image url 3',
        reviewId: 8
      },
      {
        url: 'review image url 3',
        reviewId: 9
      },
      {
        url: 'review image url 3',
        reviewId: 10
      },
      {
        url: 'review image url 3',
        reviewId: 11
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {})
  }
};
