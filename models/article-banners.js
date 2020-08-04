'use strict';
module.exports = (sequelize, DataTypes) => {
  const articleBanners = sequelize.define('articleBanners', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'article_banners'
  });
  return articleBanners;
}