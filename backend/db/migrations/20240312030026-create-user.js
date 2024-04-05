'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

options.tableName = 'Users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    // Specify the table name
    const tableName = 'Users';

    // Specify the where condition to delete all records
    const where = {};

    // Specify the options
    const truncateOptions = {
      truncate: true, // Use truncate table command
      restartIdentity: true // Automatically restart sequences owned by columns of the truncated table
    };

    // Use the bulkDelete method to delete all records and reset auto-increment
    await queryInterface.bulkDelete(tableName, where, truncateOptions);

    // Drop the table
    await queryInterface.dropTable('Users', options);
  }
};
