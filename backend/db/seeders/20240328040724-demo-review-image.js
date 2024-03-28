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
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {})
  }
};
