'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('article_likes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '点赞记录ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '点赞用户ID'
      },
      aid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '被点赞文章ID'
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章所属类别'
      },
      liked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '点赞记录状态'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('article_likes', null, {});
  }
};
