'use strict';
module.exports = (sequelize, DataTypes) => {
  const articleCommentLikes = sequelize.define('articleCommentLikes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    cid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  },
  {
    freezeTableName: true,
    tableName: 'article_comment_likes'
  });
  return articleCommentLikes;
}