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
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-35835653/original/f6c324b3-18c6-449a-84ff-353d613a8349.jpeg',
        preview: true,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/fa66c733-f094-489e-9c5b-9994e8a61e2f.jpg',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/2f31a26a-61c7-4772-ad2b-571b46ddc271.jpg',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/922f1d1d-a519-4fe6-88d1-c3ebe646a185.jpg',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/6614a593-8200-4fe5-b036-3b3869293fb9.jpg',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/c82d13d8-e0ce-4317-aaf4-719a34f4a9ca.jpeg',
        preview: true,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/b6c32ec3-b3f5-4088-ab2a-0187e44d0196.jpeg',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/531f27da-dece-48e7-9efb-f1b5f5f69163.jpeg',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/7d4381d5-6c91-4b33-9feb-8bff70a75194.jpeg',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46569587/original/20ca9a20-d716-4afa-86bd-0e0eefbe5069.jpeg',
        preview: false,
        spotId: 2
      },
      {
        url: 'https://a0.muscache.com/im/pictures/0474706d-ca7e-4e20-bab5-a4e3ebbdc315.jpg',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/aca59ccb-4b90-4a6b-bf39-cb45f741e566.jpg',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/080ef5ad-23b2-40b6-ad02-e4d12f78f7b7.jpg',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/99561bac-0c2d-4cfb-b72c-695ee18cacbc.jpg',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/c7e0b1b2-40f7-4244-a63c-5a884da394dc.jpg',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://a0.muscache.com/im/pictures/029dfb9a-1a38-4db5-8118-480f660d8362.jpg',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://a0.muscache.com/im/pictures/77b8df27-0174-4998-bc79-ea888cb92bf1.jpg',
        preview: false,
        spotId: 4
      },
      {
        url: 'https://a0.muscache.com/im/pictures/9f6b17ba-5473-4d73-85fb-f9176d5fa395.jpg',
        preview: false,
        spotId: 4
      },
      {
        url: 'https://a0.muscache.com/im/pictures/e5b5bdfd-0e84-4350-b52c-6702be69403a.jpg',
        preview: false,
        spotId: 4
      },
      {
        url: 'https://a0.muscache.com/im/pictures/bb7a8c72-1272-4896-bdbb-ae3b6eabc5e0.jpg',
        preview: false,
        spotId: 4
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-21769050/original/5b9d3238-1a57-481e-a9ca-6cd6dd9a86cc.jpeg',
        preview: true,
        spotId: 5
      },
      {
        url: 'https://a0.muscache.com/im/pictures/5f826399-c2b2-49b7-9dbc-d9d40d0dac21.jpg',
        preview: false,
        spotId: 5
      },
      {
        url: 'https://a0.muscache.com/im/pictures/a565783e-0503-417b-bb99-0de56a1230b9.jpg',
        preview: false,
        spotId: 5
      },
      {
        url: 'https://a0.muscache.com/im/pictures/02495b6c-4dda-4bcc-943f-c87309f2d98c.jpg',
        preview: false,
        spotId: 5
      },
      {
        url: 'https://a0.muscache.com/im/pictures/fec074c0-8420-4dd1-a369-dc8f1d0b5cfc.jpg',
        preview: false,
        spotId: 5
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-17223162/original/2b3dd03f-28b0-4c8a-9496-9d8a296e24c8.jpeg',
        preview: true,
        spotId: 6
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-17223162/original/2eb14390-942c-442a-b226-4b3fc4ac3848.jpeg',
        preview: false,
        spotId: 6
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-17223162/original/6edc7690-3791-4fcb-a97a-302707cd8d2c.jpeg',
        preview: false,
        spotId: 6
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-17223162/original/54193be1-4e2f-4bf0-a2d1-2dfae38d986d.jpeg',
        preview: false,
        spotId: 6
      },
      {
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-17223162/original/9cb1dd7d-e025-49cd-a9d4-7bbd03f48835.jpeg',
        preview: false,
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
