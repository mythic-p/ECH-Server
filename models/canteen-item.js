'use strict';
module.exports = (sequelize, dataTypes) => {
  const canteenItems = sequelize.define('canteenItems', {
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
      type: dataTypes.STRING(25),
      allowNull: false
    },
    price: {
      type: dataTypes.INTEGER,
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
    category: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: dataTypes.STRING,
      allowNull: false
    } 
  },
  {
    freezeTableName: true,
    tableName: 'canteen_items'
  });
  return canteenItems;
}