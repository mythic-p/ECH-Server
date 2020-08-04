'use strict';
module.exports = (sequelize, dataTypes) => {
  const canteenCategories = sequelize.define('canteenCategories', {
    _id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: dataTypes.STRING(10),
      allowNull: false
    },
    cid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    sid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    freezeTableName: true,
    tableName: 'canteen_categories'
  });
  return canteenCategories;
}