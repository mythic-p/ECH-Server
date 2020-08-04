'use strict';
module.exports = (sequelize, dataTypes) => {
  const canteenTables = sequelize.define('canteenTables', {
    _id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    code: {
      type: dataTypes.STRING(10),
      allowNull: false
    },
    sid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    cid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    seatsNum: {
      type: dataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true,
    tableName: 'canteen_tables'
  });
  return canteenTables;
}