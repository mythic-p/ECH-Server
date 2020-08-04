'use strict';
module.exports = (sequelize, DataTypes) => {
  const articleComment = sequelize.define('articleComments', {
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
    aid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true,
    tableName: 'article_comments',
    version: 'version'
  });
  return articleComment;
}