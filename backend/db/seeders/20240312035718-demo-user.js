'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.validate = true;
options.tableName = 'Users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'demo',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Derek',
        lastName: 'Lin',
        email: 'derek@user.io',
        username: 'derek',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Robinne',
        lastName: 'Depante',
        email: 'robinne@user.io',
        username: 'robinne',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Louis',
        lastName: 'Lin',
        email: 'louis@user.io',
        username: 'louis',
        hashedPassword: bcrypt.hashSync('password4')
      },

    ], options);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  }
};
