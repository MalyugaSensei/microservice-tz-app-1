'use strict';
const {
  Model,
  Sequelize,
} = require('sequelize');
/**
 * 
 * @param { Sequelize } sequelize 
 * @param { import('sequelize').DataTypes } DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    problems: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    indexes: [
      {
        fields: ['problems'],
      }
    ],
    sequelize,
    modelName: 'User',
  });
  return User;
};