'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('canteen_tables', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '餐桌ID'
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: '餐桌代号'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      cid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '食堂ID'
      },
      seatsNum: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '该餐桌的椅子数量'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('canteen_tables', null, {})
  }
};
