'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_profile', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '用户信息ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '所属用户ID'
      },
      nickname: {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: '昵称'
      },
      school: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '学校名称'
      },
      academy: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '学院名称'
      },
      class: {
        type: Sequelize.STRING(15),
        allowNull: true,
        comment: '班级名称'
      },
      realname: {
        type: Sequelize.STRING(15),
        allowNull: true,
        comment: '真名'
      },
      sno: {
        type: Sequelize.STRING(20),
        comment: '学号'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_profile', null, {});
  }
};
