'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pk_count', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '表计数ID'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '表名'
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
        comment: '当前最大ID值'
      },
      version: {
        type: Sequelize.INTEGER,
        comment: '乐观锁版本计数',
        defaultValue: 0
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pk_count');
  }
};
