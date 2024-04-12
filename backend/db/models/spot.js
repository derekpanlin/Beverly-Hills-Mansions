'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(750),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      get() {
        return this.getDataValue('createdAt').toISOString().replace('T', ' ').split('.')[0];
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      get() {
        return this.getDataValue('updatedAt').toISOString().replace('T', ' ').split('.')[0];
      },
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
