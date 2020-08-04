'use strict';

module.exports = (sequelize, DataTypes) => {
  const healthySignIn = sequelize.define('healthySignIn', {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    temperature: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    signInAt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    signInRec: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'healthy_signin'
  });
  return healthySignIn;
}