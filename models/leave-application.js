'use strict';
module.exports = (sequelize, dataTypes) => {
  const leaveApplications = sequelize.define('leaveApplications', {
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
    uid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    leaveTime: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    backTime: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: dataTypes.STRING(210),
      allowNull: false
    },
    pictures: dataTypes.TEXT,
    signature: dataTypes.STRING
  },
  {
    freezeTableName: true,
    tableName: 'leave_applications'
  });
  return leaveApplications;
}