'use strict';
module.exports = (sequelize, dataTypes) => {
  const canteenSeats = sequelize.define('canteenSeats', {
    _id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    tid: {
      type: dataTypes.INTEGER,
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
    dir: {
      type: dataTypes.CHAR(1),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'canteen_seats'
  });
  return canteenSeats;
}