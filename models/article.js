'use strict';
module.exports = (sequelize, DataTypes) => {
  const article = sequelize.define('articles', {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    tags: DataTypes.STRING(100),
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    availability: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  },
  {
    freezeTableName: true,
    version: 'version'
  });
  return article;
}