'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('canteen_categories', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '菜品类别ID'
      },
      name: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: "类别名称"
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('canteen_categories', null, {});
  }
};
