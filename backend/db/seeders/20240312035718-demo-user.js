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
        firstName: 'Derek',
        lastName: 'Lin',
        email: 'derek@user.io',
        username: 'derek',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Robinne',
        lastName: 'Depante',
        email: 'robinne@user.io',
        username: 'robinne',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Louis',
        lastName: 'Lin',
        email: 'louis@user.io',
        username: 'louis',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demouser@user.io',
        username: 'demouser',
        hashedPassword: bcrypt.hashSync('password4')
      },

    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.truncate = true;
    options.cascade = true;
    options.restartIdentity = true;

    await queryInterface.bulkDelete(options, null, {});
  }
};
