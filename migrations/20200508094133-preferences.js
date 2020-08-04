'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('preferences', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '偏好设置ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: '偏好名称'
      },
      value: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: '偏好数值'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('preferences', null, {});
  }
};
