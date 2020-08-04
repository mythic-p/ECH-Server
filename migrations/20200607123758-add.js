'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bathhouses', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '澡堂ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: '澡堂名称'
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        comment: '订单代号'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bathhouses', null, {})
  }
};
