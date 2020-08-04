'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('article_fav', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '收藏记录ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '操作用户ID'
      },
      aid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '被收藏的文章ID'
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章所属类别'
      },
      favorited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '收藏记录状态'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('article_fav', null, {});
  }
};
