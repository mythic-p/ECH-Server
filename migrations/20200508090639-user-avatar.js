'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_avatar', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '用户头像ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
      },
      url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
        comment: '头像图片URL'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_avatar', null, {});
  }
};
