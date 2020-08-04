'use strict';
module.exports = (sequelize, dataTypes) => {
  const canteenAppointments = sequelize.define('canteenAppointments', {
    _id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    uid: {
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
    beginTime: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    endTime: dataTypes.INTEGER,
    type: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    items: {
      type: dataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    seat: dataTypes.INTEGER,
    table: dataTypes.INTEGER
  },
  {
    freezeTableName: true,
    tableName: 'canteen_appointments'
  });
  return canteenAppointments;
}