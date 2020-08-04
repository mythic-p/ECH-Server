'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leave_applications', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '申请单ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '申请的审批状态'
      },
      leaveTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '离校时间'
      },
      backTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '返校时间'
      },
      reason: {
        type: Sequelize.STRING(210),
        allowNull: false,
        comment: '离校理由'
      },
      pictures: {
        type: Sequelize.TEXT,
        comment: '附加图片的URL组，URL之间用|隔开'
      },
      signature: {
        type: Sequelize.STRING,
        comment: '手写签名图片URL'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('leave_applications', null, {})
  }
};
