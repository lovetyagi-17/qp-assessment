'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('userOrders', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      productId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      createdAt: { type: Sequelize.DATE, default: new Date() },
      updatedAt: { type: Sequelize.DATE, default: new Date() },
      deletedAt: { type: Sequelize.DATE, default: new Date() },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('userOrders');
  }
};
