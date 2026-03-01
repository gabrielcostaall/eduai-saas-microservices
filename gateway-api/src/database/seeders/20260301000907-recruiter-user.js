'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("recruiter123", 10);
    const [existing] = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE username = 'Recruiter' LIMIT 1`
  );
  

  if (existing.length > 0) return;
    await queryInterface.bulkInsert('users', [{
      username: 'Recruiter',
      password: hashedPassword,
      created_at: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};