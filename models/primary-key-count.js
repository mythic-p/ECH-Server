'use strict';
module.exports = (sequelize, DataTypes) => {
  const primaryKeyCount = sequelize.define('primaryKeyCount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: 'pk_count',
    freezeTableName: true,
    version: 'version'
  })

  return primaryKeyCount;
}