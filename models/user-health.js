'use strict';
module.exports = (sequelize, DataTypes) => {
  const userHealth = sequelize.define('userHealth', {
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
    healthy: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      allowNull: false
    },
  },
  {
    freezeTableName: true,
    tableName: 'user_health'
  });
  return userHealth;
}