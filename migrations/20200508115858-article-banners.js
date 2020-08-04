'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('article_banners', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '疫情小知识轮播图ID'
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '轮播图权重，大的出现在先'
      },
      aid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '轮播图对应文章ID'
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章类别'
      },
      url: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false,
        comment: '轮播图图片URL'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('article_banners');
  }
};
