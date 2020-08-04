'use strict';

module.exports = (sequelize, DataTypes) => {
  const school = sequelize.define('school', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  },
  {
    freezeTableName: true
  })
  return school;
}