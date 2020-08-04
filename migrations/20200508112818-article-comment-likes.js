'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('article_comment_likes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: '文章评论点赞记录ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        comment: '用户ID'
      },
      cid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '评论ID'
      },
      liked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: '评论点赞状态'
      },
      aid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章ID'
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章类别'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('article_comment_likes', null, {});
  }
};
