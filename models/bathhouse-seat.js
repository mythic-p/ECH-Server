'use strict';
module.exports = (sequelize, dataTypes) => {
  const bathhouseSeats = sequelize.define('bathhouseSeats', {
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
    bid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    code: {
      type: dataTypes.STRING(10),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'bathhouse_seats'
  });
  return bathhouseSeats;
}