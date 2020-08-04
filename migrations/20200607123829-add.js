'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bathhouse_seats', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '淋浴位ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      bid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '澡堂ID'
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: '淋浴位编号'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bathhouse_seats', null, {})
  }
};
