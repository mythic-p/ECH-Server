'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leave_replies', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '审批回复ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '操作者用户ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      aid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '申请ID'
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '回复类型'
      },
      signature: {
        type: Sequelize.STRING,
        comment: '同意审批的审核人签名图片URL'
      },
      reason: {
        type: Sequelize.STRING,
        comment: '驳回理由'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('leave_replies', null, {})
  }
};
