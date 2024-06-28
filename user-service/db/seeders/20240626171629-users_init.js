'use strict';

const user = require('../../db/models/user');
const { generateUser } = require('../../helper/mock_data_generator')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      const [results, metadata] = await queryInterface.sequelize.query('select count(*) as count from "Users" n', { transaction });
      const count = results[0].count
      let users = [];

      if (count > 1) {
        return
      }

      for (let i = 0; i < 1200000; i++) {
        users.push(generateUser())
      }

      const chunkSize = 10000;
      for (let i = 0; i < users.length; i += chunkSize) {
        await queryInterface.bulkInsert('Users', users.slice(i, i + chunkSize), {});
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('Users', null, { transaction: transaction });
      await transaction.commit()
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
