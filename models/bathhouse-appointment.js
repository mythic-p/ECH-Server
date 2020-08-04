'use strict';
module.exports = (sequelize, dataTypes) => {
  const bathhouseAppointments = sequelize.define('bathhouseAppointments', {
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
    sid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    bid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    seat: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    beginTime: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    endTime: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'bathhouse_appointments'
  });
  return bathhouseAppointments;
}