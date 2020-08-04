'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('canteen_appointments', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '预约订单ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '下订单的用户ID'
      },
      cid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '食堂ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      beginTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '开始堂食时间/取餐时间/理想送达时间'
      },
      endTime: {
        type: Sequelize.INTEGER,
        comment: '结束堂食时间'
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '订单类型'
      },
      items: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '预约的菜品列表，用|隔开'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '订单的总价'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '当前预约订单的状态'
      },
      seat: {
        type: Sequelize.INTEGER,
        comment: '堂食选择的餐桌座位ID'
      },
      table: {
        type: Sequelize.INTEGER,
        comment: '堂食选择的餐桌ID'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('canteen_appointments', null, {})
  }
};
