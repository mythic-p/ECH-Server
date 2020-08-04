'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('healthy_signin', {
      _id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '打卡记录ID'
      },
      uid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学号'
      },
      sid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '学校ID'
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '当天打卡次数'
      },
      temperature: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '温度，用|隔开'
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '打卡位置，格式x,y，x表示纬度,y表示经度。用|隔开每次打卡记录的位置'
      },
      signInAt: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '当日首次打卡的时间戳'
      },
      signInRec: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '记录每次打卡的时间段，用|隔开'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('healthy_signin', null, {});
  }
};
