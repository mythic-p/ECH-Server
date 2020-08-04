'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_health', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '用户健康情况ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      healthy: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        allowNull: false,
        comment: '用户是否健康'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_health');
  }
};
