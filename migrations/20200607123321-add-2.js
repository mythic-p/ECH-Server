'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('canteen_items', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '菜品ID'
      },
      name: {
        type: Sequelize.STRING(25),
        allowNull: false,
        comment: '菜品名称'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '菜品价格'
      },
      cid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '食堂ID'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "学校ID"
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '菜品所属的类别ID'
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '菜品的展示图片URL'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('canteen_items', null, {});
  }
};
