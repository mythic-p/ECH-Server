'use strict';

module.exports = (sequelize, DataTypes) => {
  const orderAnnouncement = sequelize.define('orderAnnouncements', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'order_announcements'
  });
  return orderAnnouncement;
}