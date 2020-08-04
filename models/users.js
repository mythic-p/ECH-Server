'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    role: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  });

  return users;
};