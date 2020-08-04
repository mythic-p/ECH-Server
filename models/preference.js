'use strict';
module.exports = (sequelize, DataTypes) => {
  const preference = sequelize.define('preferences', {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    freezeTableName: true
  });
  return preference;
}