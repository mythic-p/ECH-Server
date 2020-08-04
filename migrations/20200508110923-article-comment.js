'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('article_comments', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章评论ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
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
      content: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false,
        comment: '评论内容'
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '点赞数'
      },
      version: {
        type: Sequelize.INTEGER,
        comment: '乐观锁计数',
        defaultValue: 0
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('article_comments', null, {});
  }
};
