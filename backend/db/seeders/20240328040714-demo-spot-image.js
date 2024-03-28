'use strict';

const { query } = require('express');
const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.validate = true;
options.tableName = 'SpotImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        url: 'image url 1',
        preview: true,
        spotId: 1
      },
      {
        url: 'image url 2',
        preview: false,
        spotId: 2
      },
      {
        url: 'image url 3',
        preview: true,
        spotId: 3
      },
      {
        url: 'image url 4',
        preview: false,
        spotId: 4
      },
      {
        url: 'image url 5',
        preview: true,
        spotId: 5
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {})
  }
};
