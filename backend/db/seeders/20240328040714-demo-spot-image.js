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
        url: 'https://images.mansionglobal.com/im-85912284',
        preview: true,
        spotId: 1
      },
      {
        url: 'https://images.mansionglobal.com/im-01364509',
        preview: true,
        spotId: 2
      },
      {
        url: 'https://images.mansionglobal.com/im-17433983',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://media.architecturaldigest.com/photos/5e74f74713ef7b000832f09b/16:9/w_2560%2Cc_limit/S2.jpg',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://images.mansionglobal.com//im-697060',
        preview: true,
        spotId: 5
      },
      {
        url: 'https://i.pinimg.com/originals/ce/0e/79/ce0e79428abb569d7dbb69d9701976ae.jpg',
        preview: true,
        spotId: 6
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {

    options.truncate = true;
    options.cascade = true;
    options.restartIdentity = true;

    await queryInterface.bulkDelete(options, null, {})
  }
};
