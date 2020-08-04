'use strict';
module.exports = (sequelize, dataTypes) => {
  const leaveReplies = sequelize.define('leaveReplies', {
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
    aid: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    signature: dataTypes.STRING,
    reason: dataTypes.STRING
  },
  {
    freezeTableName: true,
    tableName: 'leave_replies'
  });
  return leaveReplies;
}