'use strict';
module.exports = (sequelize, DataTypes) => {
  const userAvatar = sequelize.define('userAvatar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
  },
  {
    freezeTableName: true,
    tableName: 'user_avatar'
  })
  return userAvatar;
}