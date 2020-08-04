'use strict';
module.exports = (sequelize, DataTypes) => {
  const articleFavorites = sequelize.define('articleFavorites', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    uid: {
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
    favorited: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'article_fav'
  })
  return articleFavorites;
}