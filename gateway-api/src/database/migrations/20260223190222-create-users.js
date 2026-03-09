"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      totp_secret: {
        type: Sequelize.STRING(64),
        allowNull: true,
        defaultValue: null,
      },
      totp_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      failed_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      locked_until: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  }
};