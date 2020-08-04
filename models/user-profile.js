'use strict';
module.exports = (sequelize, DataTypes) => {
  const userProfile = sequelize.define('userProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nickname: DataTypes.STRING(30),
    school: DataTypes.STRING(20),
    academy: DataTypes.STRING(20),
    class: DataTypes.STRING(15),
    sno: DataTypes.STRING(20),
    realname: DataTypes.STRING(15)
  },
  {
    freezeTableName: true,
    tableName: 'user_profile'
  })
  return userProfile;
}