'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('canteens', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '食堂设置的主键ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: '食堂名称'
      },
      code: {
        type: Sequelize.STRING(5),
        allowNull: false,
        comment: '食堂订单代号，必须为5个大写英文字符'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('canteens', null, {});
  }
};
