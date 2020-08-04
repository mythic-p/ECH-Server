'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bathhouse_appointments', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '澡堂预约订单ID'
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
      bid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '澡堂ID'
      },
      seat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '淋浴位ID'
      },
      beginTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '预约的开始洗浴时间'
      },
      endTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '预定的结束洗浴时间'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '预约的订单状态'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bathhouse_appointments', null, {})
  }
};
