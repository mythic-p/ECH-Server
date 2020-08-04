'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('articles', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '撰写文章的用户ID'
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: '文章标题'
      },
      desc: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: '文章概述'
      },
      content: {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        comment: '文章内容'
      },
      tags: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '文章标签，标签之间|隔开'
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章点赞数'
      },
      availability: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章开放权限'
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '文章类别'
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
    return queryInterface.dropTable('articles', null, {});
  }
};
