'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('canteen_seats', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '座位ID'
      },
      tid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '桌子的ID'
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
      dir: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        comment: '椅子的朝向,U,D,L,R'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('canteen_seats', null, {})
  }
};
