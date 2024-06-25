'use strict';
const {
  Model
} = require('sequelize');
/**
 * 
 * @param { import('sequelize').Sequelize } sequelize 
 * @param { import('sequelize').DataTypes } DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
  class UserActions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserActions.init({
    user_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    additional_data: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'UserActions',
  });
  return UserActions;
};