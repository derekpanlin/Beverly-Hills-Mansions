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
        url: 'review image url 4',
        reviewId: 4
      },
      {
        url: 'review image url 5',
        reviewId: 5
      },
      {
        url: 'review image url 6',
        reviewId: 6
      },
      {
        url: 'review image url 7',
        reviewId: 7
      },
      {
        url: 'review image url 8',
        reviewId: 8
      },
      {
        url: 'review image url 9',
        reviewId: 9
      },
      {
        url: 'review image url 10',
        reviewId: 10
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
