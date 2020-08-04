'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable('users', {
     id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       allowNull: false,
       comment: '用户ID'
     },
     username: {
       type: Sequelize.STRING(20),
       allowNull: false,
       comment: '用户名'
     },
     role: {
       type: Sequelize.SMALLINT,
       allowNull: false,
       comment: '身份'
     },
     password: {
      type: Sequelize.STRING(80),
      allowNull: false,
      comment: '密码'
     },
     createdAt: Sequelize.DATE,
     updatedAt: Sequelize.DATE
   });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
