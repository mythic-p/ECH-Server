'use strict';
module.exports = (sequelize, DataTypes) => {
  const articleLikes = sequelize.define('articleLikes', {
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
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    tableName: 'article_likes'
  });
  return articleLikes;
}