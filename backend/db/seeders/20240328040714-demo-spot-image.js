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
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-35835653/original/f6c324b3-18c6-449a-84ff-353d613a8349.jpeg?im_w=1200',
        preview: true,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/fa66c733-f094-489e-9c5b-9994e8a61e2f.jpg?im_w=1440',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/2f31a26a-61c7-4772-ad2b-571b46ddc271.jpg?im_w=1440',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/922f1d1d-a519-4fe6-88d1-c3ebe646a185.jpg?im_w=1440',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/6614a593-8200-4fe5-b036-3b3869293fb9.jpg?im_w=1440',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/c82d13d8-e0ce-4317-aaf4-719a34f4a9ca.jpeg?im_w=1440',
        preview: true,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/b6c32ec3-b3f5-4088-ab2a-0187e44d0196.jpeg?im_w=1440',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/531f27da-dece-48e7-9efb-f1b5f5f69163.jpeg?im_w=1440',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/7d4381d5-6c91-4b33-9feb-8bff70a75194.jpeg?im_w=1200',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/20ca9a20-d716-4afa-86bd-0e0eefbe5069.jpeg?im_w=1440',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/0474706d-ca7e-4e20-bab5-a4e3ebbdc315.jpg?im_w=1200',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/aca59ccb-4b90-4a6b-bf39-cb45f741e566.jpg?im_w=1440',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/080ef5ad-23b2-40b6-ad02-e4d12f78f7b7.jpg?im_w=1200',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/99561bac-0c2d-4cfb-b72c-695ee18cacbc.jpg?im_w=1440',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/c7e0b1b2-40f7-4244-a63c-5a884da394dc.jpg?im_w=1440',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://media.architecturaldigest.com/photos/5e74f74713ef7b000832f09b/16:9/w_2560%2Cc_limit/S2.jpg',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://media.architecturaldigest.com/photos/5e74f74713ef7b000832f09b/16:9/w_2560%2Cc_limit/S2.jpg',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://media.architecturaldigest.com/photos/5e74f74713ef7b000832f09b/16:9/w_2560%2Cc_limit/S2.jpg',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://media.architecturaldigest.com/photos/5e74f74713ef7b000832f09b/16:9/w_2560%2Cc_limit/S2.jpg',
        preview: true,
        spotId: 4
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
        url: 'https://images.mansionglobal.com//im-697060',
        preview: true,
        spotId: 5
      },
      {
        url: 'https://images.mansionglobal.com//im-697060',
        preview: true,
        spotId: 5
      },
      {
        url: 'https://images.mansionglobal.com//im-697060',
        preview: true,
        spotId: 5
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
      },
      {
        url: 'https://i.pinimg.com/originals/ce/0e/79/ce0e79428abb569d7dbb69d9701976ae.jpg',
        preview: true,
        spotId: 6
      },
      {
        url: 'https://i.pinimg.com/originals/ce/0e/79/ce0e79428abb569d7dbb69d9701976ae.jpg',
        preview: true,
        spotId: 6
      },
      {
        url: 'https://i.pinimg.com/originals/ce/0e/79/ce0e79428abb569d7dbb69d9701976ae.jpg',
        preview: true,
        spotId: 6
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
