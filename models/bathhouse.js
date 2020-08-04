'use strict';
module.exports = (sequelize, dataTypes) => {
  const bathhouse = sequelize.define('bathhouses', {
    _id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    sid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: dataTypes.STRING(40),
      allowNull: false
    },
    code: {
      type: dataTypes.STRING(3),
      allowNull: false
    }
  },
  {
    freezeTableName: true
  });
  return bathhouse;
}