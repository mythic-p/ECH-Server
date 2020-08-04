// 文章控制器类
// 用于文章相关数据的CRUD
// 关于 Availability
// 1: 只有登录的用户才能访问该篇文章
// 2: 只有总管理员，社区管理员和文章作者可以访问该篇文章
// 3: 该文章被锁定，只有在数据库中能看到原文
// 关于 CategoryId
// 1: 疫情小知识
// 2: 心得
// 关于 Order
// 1: 按照createdAt降序
// 2: 按照createdAt升序
// 3: 按照updatedAt降序
// 4: 按照updatedAt升序
const models = require('../models');
const {Validator, validationRules} = require('../utils/validator');
const {getValidOrder, convertOrderToArray, ecode, ecode2} = require('../utils/');
/**
 * 获取可以访问文章的可见度
 */
const getAvailability = [1, 2];
/**
 * 获取文章类别数组
 */
const getCategoryType = [1, 2];
/**
 * 文章管理静态类
 */
class ArticleController {
  /**
   * 创建一篇文章
   * @param {number} uid 文章所属用户ID
   * @param {number} sid 学校ID
   * @param {string} title 文章标题
   * @param {string} desc 文章简介
   * @param {string} content 文章具体内容
   * @param {string} tags 文章的标签，用|隔开，可以是空字符串
   * @param {number} availability 文章的开放等级
   * @param {number} categoryId 文章的类别
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async CreateArticle(uid, sid, title, desc, content, tags, availability, categoryId) {
    uid = +uid;
    sid = +sid;
    availability = +availability;
    categoryId = +categoryId;
    title = title || "";
    desc = desc || "";
    content = content || "";
    const checkRules = [
      [uid, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [sid, [validationRules.greaterThan, 0], ecode.SCHOOL_INVALID_ID],
      [title.trim().length, [validationRules.greaterThan, 0], ecode.ARTICLE_EMPTY_TITLE],
      [desc.trim().length, [validationRules.greaterThan, 0], ecode.ARTICLE_EMPTY_DESC],
      [content.trim().length, [validationRules.greaterThan, 0], ecode.ARTICLE_EMPTY_CONTENT],
      [availability, [validationRules.include, getAvailability()], ecode.ARTICLE_INVALID_AVAILABILITY],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [title.length, [validationRules.lessThan, 25], ecode.ARTICLE_TITLE_TOO_LONG],
      [desc.length, [validationRules.lessThan, 190], ecode.ARTICLE_DESC_TOO_LONG],
      [content.length, [validationRules.lessThan, 2500], ecode.ARTICLE_CONTENT_TOO_LONG]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: uid}})) < 1;
    if (userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const schoolExists = (await models.school.count({where: {id: sid}})) < 1;
    if (schoolExists) {
      return ecode2.SCHOOL_NOT_EXISTS;
    }
    const articleExists = (await models.articles.count({where: {title, category: categoryId}})) >= 1;
    if (articleExists) {
      return ecode2.ARTICLE_SAME_TITLE;
    }
    const {'0': pk} = await models.primaryKeyCount.findOrCreate({where: {name: `article_${categoryId}`}, defaults: {name: `article_${categoryId}`, count: 1}, attributes: ['id', 'count']});
    await models.articles.create({id: pk.getDataValue('count'), uid, sid, title, desc, content, tags, availability, category: categoryId, likes: 0});
    await pk.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 查询一篇指定ID和类别的文章详情
   * @param {number} id 被查找文章的ID
   * @param {number} categoryId 被查找文章的类别
   * @returns {{code: number, msg: string, article: {uid: number, title: string, content: string, likes: number}}} 执行结果，错误信息，文章
   */
  static async GetArticleById(id, categoryId) {
    id = +id;
    categoryId = +categoryId;
    const checkRules = [
      [id, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType], ecode.ARTICLE_INVALID_CATEGORY_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const article = await models.articles.findOne({where: {id, category: categoryId}, attributes: ['uid', 'title', 'content', 'likes']});
    if (article === null) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    return {...ecode2.SUCCESS, article};
  }
  /**
   * 更新指定ID和类别的文章信息
   * @param {number} id 被更新文章的ID
   * @param {number} categoryId 类别
   * @param {string} updatedInfo 被更新的字段
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async UpdateArticleById(id, categoryId, updatedInfo) {
    id = +id;
    categoryId = +categoryId;
    try {
      updatedInfo = JSON.parse(updatedInfo);
    } catch (error) {
      return ecode2.UPDATE_FIELDS_INVALID_FORMAT;
    }
    const checkRules = [
      [id, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [updatedInfo.length, [validationRules.greaterThanEqual, 1], ecode.UPDATE_EMPTY_FIELDS]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const exists = await (models.articles.count({where: {id, category: categoryId}})) >= 1;
    if (!exists) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    await models.articles.update({...updatedInfo}, {where: {id, category: categoryId}});
    return ecode2.SUCCESS;
  }
  /**
   * 获取一组按照指定排序规则和类别的文章粗略信息
   * @param {number} categoryId 文章类别
   * @param {number} page 页数
   * @param {number} size 大小
   * @param {number} order 排序规则
   * @returns {{code: number, msg: string, articles: {id: number, uid: number, title: string, desc: string, tags: string[]}[]}} 执行结果，错误信息，一组文章
   */
  static async GetArticlesByCategoryId(categoryId, page, size, order) {
    categoryId = +categoryId;
    page = +page || 1;
    size = +size || 5;
    order = +order;
    const checkRules = [
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [page, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_PAGE],
      [size, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_SIZE],
      [order, [validationRules.include, getValidOrder()], ecode.SORT_INVALID_ORDER]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    // 根据order数值，进行转换
    order = convertOrderToArray(order);
    const articles = await models.articles.findAll({
      limit: size,
      offset: (page - 1) * size,
      where: {category: categoryId},
      attributes: ['id', 'uid', 'title', 'desc', 'tags'],
      order
    });
    return {...ecode2.SUCCESS, articles};
  }
  /**
   * 对指定文章进行点赞/取消点赞操作
   * @param {number} userId 执行操作的用户ID
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别编号
   * @param {boolean} like 是否点赞
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async SetArticleLikeById(userId, articleId, categoryId, like) {
    userId = +userId;
    articleId = +articleId;
    categoryId = +categoryId;
    like = like === 'true' ? true : false;
    const checkRules = [
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const article = await models.articles.findOne({where: {id: articleId, category: categoryId}, attributes: ['likes', 'id', 'category']});
    if (article === null) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const {'0': articleLike, '1': newCreated} = await models.articleLikes.findOrCreate({where: {uid: userId, aid: articleId, category: categoryId}, defaults: {uid: userId, aid: articleId, category: categoryId, liked: 0}});
    if (newCreated === true && !like) {
      return ecode2.ARTICLE_INVALID_CANCEL_LIKE;
    } else if (articleLike.getDataValue('liked') === like) {
      return !like ? ecode2.ARTICLE_REPEAT_CANCEL_LIKE : ecode2.ARTICLE_REPEAT_LIKE;
    }
    articleLike.setDataValue('liked', like);
    await models.articles.increment('likes', {where: {id: articleId, category: categoryId}, by: like ? 1 : -1});
    await articleLike.save();
    return ecode2.SUCCESS;
  }
  /**
   * 查询指定用户对指定文章的点赞情况
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} userId 用户ID
   * @returns {{code: number, msg: string, isLiked: boolean}} 执行结果，错误信息，该文章是否被点赞
   */
  static async GetArticleLikeById(articleId, categoryId, userId) {
    articleId = +articleId;
    categoryId = +categoryId;
    userId = +userId;
    const checkRules = [
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const articleExist = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExist) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const likeModel = await models.articleLikes.findOne({where: {aid: articleId, category: categoryId, uid: userId}, attributes: ['liked']});
    const isLiked = likeModel ? likeModel.getDataValue('liked') : false;
    return {...ecode2.SUCCESS, isLiked};
  }
  /**
   * 设置指定用户对指定文章的收藏状态
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} userId 用户ID
   * @param {boolean} favorite 是否收藏
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async SetArticleFavById(articleId, categoryId, userId, favorite) {
    articleId = +articleId;
    categoryId = +categoryId;
    userId = +userId;
    favorite = favorite === 'true' ? true : false;
    const checkRules = [
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const articleExists = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExists) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const {'0': favModel, '1': newCreated} = await models.articleFavorites.findOrCreate({where: {uid: userId, aid: articleId, category: categoryId}, defaults: {uid: userId, aid: articleId, category: categoryId, favorited: 0}});
    if (newCreated && !favorite) {
      return ecode2.ARTICLE_INVALID_CANCEL_FAVORITE;
    } else if (favModel.getDataValue('favorited') === favorite) {
      return favorite ? ecode2.ARTICLE_REPEAT_FAVORITE : ecode2.ARTICLE_REPEAT_CANCEL_FAVORITE;
    }
    favModel.setDataValue('favorited', favorite);
    await favModel.save();
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定用户对指定文章的收藏状态
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} userId 用户ID
   * @returns {{code: number, msg: string, isFavorited: boolean}} 执行结果，错误信息，文章是否被收藏
   */
  static async GetArticleFavById(articleId, categoryId, userId) {
    articleId = +articleId;
    categoryId = +categoryId;
    userId = +userId;
    const checkRules = [
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const articleExists = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExists) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const articleFav = await models.articleFavorites.findOne({where: {uid: userId, aid: articleId, category: categoryId}, attributes: ['favorited']});
    const isFavorited = articleFav ? articleFav.getDataValue('favorited') : false;
    return {...ecode2.SUCCESS, isFavorited};
  }
  /**
   * 从指定文章中按照指定的排序规则，获取一定数量的评论
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} page 页数
   * @param {number} size 大小
   * @param {number} order 排序规则
   * @returns {{code: number, msg: string, comments: {id: number, uid: number, content: string, likes: number}[]}} {code, msg, comments} 执行结果，错误信息，评论
   */
  static async GetCommentsById(articleId, categoryId, page, size, order) {
    articleId = +articleId;
    categoryId = +categoryId;
    page = +page || 1;
    size = +size || 5;
    order = +order;
    const checkRules = [
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [page, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_PAGE],
      [size, [validationRules.greaterThan, 0], ecode.PAGINATION_INVALID_SIZE],
      [order, [validationRules.include, getValidOrder()], ecode.SORT_INVALID_ORDER]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const articleExist = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExist) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    order = convertOrderToArray(order);
    return {...ecode2.SUCCESS, comments: await models.articleComments.findAll({
      where: {aid: articleId, category: categoryId},
      offset: (page - 1) * size,
      limit: size,
      attributes: ['id', 'uid', 'content', 'likes'],
      order
    })};
  }
  /**
   * 向指定文章添加一条指定用户的评论
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} userId 用户ID
   * @param {string} content 评论内容
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async AddComment(articleId, categoryId, userId, content) {
    articleId = +articleId;
    categoryId = +categoryId;
    userId = +userId;
    const checkRules = [
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID],
      [content.length, [validationRules.greaterThan, 0], ecode.ARTICLE_COMMENT_CONTENT_EMPTY],
      [content.length, [validationRules.lessThan, 200], ecode.ARTICLE_COMMENT_CONTENT_TOO_LONG]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const articleExists = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExists) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const pkName = `comment_${categoryId}_${articleId}`;
    const {'0': pkModel} = await models.primaryKeyCount.findOrCreate({where: {name: pkName}, defaults: {name: pkName, count: 1}, attributes: ['id', 'count']});
    await models.articleComments.create({id: pkModel.getDataValue('count'), uid: userId, aid: articleId, category: categoryId, content, likes: 0});
    await pkModel.increment('count', {by: 1});
    return ecode2.SUCCESS;
  }
  /**
   * 对指定文章的指定评论进行点赞/取消点赞的操作
   * @param {number} commentId 评论ID
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} userId 用户ID
   * @param {boolean} like 点赞/取消点赞
   * @returns {{code: number, msg: string}} 执行结果，错误信息
   */
  static async SetCommentLikeById(commentId, articleId, categoryId, userId, like) {
    commentId = +commentId;
    articleId = +articleId;
    categoryId = +categoryId;
    userId = +userId;
    like = like === 'true' ? 1 : 0;
    const checkRules = [
      [commentId, [validationRules.greaterThan, 0], ecode.ARTICLE_COMMENT_INVALID_ID],
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const articleExists = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExists) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const comment = await models.articleComments.findOne({where: {id: commentId, aid: articleId, category: categoryId}, attributes: ['id', 'likes']});
    if (comment === null) {
      return ecode2.ARTICLE_COMMENT_NOT_EXISTS;
    }
    const cid = comment.getDataValue('id');
    const {'0': comLikeModel, '1': newCreated} = await models.articleCommentLikes.findOrCreate({where: {cid, aid: articleId, category: categoryId}, defaults: {uid: userId, aid: articleId, category: categoryId, cid, liked: like}});
    const likeState = comLikeModel.getDataValue('liked');
    if (newCreated && !like) {
      return ecode2.ARTICLE_INVALID_CANCEL_LIKE;
    } else if (likeState === like) {
      return like ? ecode2.ARTICLE_REPEAT_LIKE : ecode2.ARTICLE_REPEAT_CANCEL_LIKE;
    }
    comLikeModel.setDataValue('liked', like);
    await models.articleComments.increment('likes', {where: {id: commentId, aid: articleId, category: categoryId}, by: like ? 1 : -1});
    await comLikeModel.save();
    return ecode2.SUCCESS;
  }
  /**
   * 获取指定用户对指定评论的点赞情况
   * @param {number} commentId 评论ID
   * @param {number} articleId 文章ID
   * @param {number} categoryId 文章类别
   * @param {number} userId 用户ID
   * @returns {{code: number, msg: string, isLiked: boolean}} 执行结果，错误信息，是否点赞
   */
  static async GetCommentLikeById(commentId, articleId, categoryId, userId) {
    commentId = +commentId;
    articleId = +articleId;
    categoryId = +categoryId;
    userId = +userId;
    const checkRules = [
      [commentId, [validationRules.greaterThan, 0], ecode.ARTICLE_COMMENT_INVALID_ID],
      [articleId, [validationRules.greaterThan, 0], ecode.ARTICLE_INVALID_ID],
      [categoryId, [validationRules.include, getCategoryType()], ecode.ARTICLE_INVALID_CATEGORY_ID],
      [userId, [validationRules.greaterThan, 0], ecode.USER_INVALID_ID]
    ];
    const checkResult = new Validator(checkRules).Validate();
    if (checkResult) {
      return {...checkResult};
    }
    const commentExists = (await models.articleComments.count({where: {id: commentId, aid: articleId, category: categoryId}})) >= 1;
    if (!commentExists) {
      return ecode2.ARTICLE_COMMENT_NOT_EXISTS;
    }
    const articleExists = (await models.articles.count({where: {id: articleId, category: categoryId}})) >= 1;
    if (!articleExists) {
      return ecode2.ARTICLE_NOT_EXISTS;
    }
    const userExists = (await models.users.count({where: {id: userId}})) >= 1;
    if (!userExists) {
      return ecode2.USER_NOT_EXISTS;
    }
    const likeModel = await models.articleCommentLikes.findOne({where: {cid: commentId, aid: articleId, category: categoryId}, attributes: ['liked']});
    const isLiked = likeModel ? likeModel.getDataValue('liked') : false;
    return {...ecode2.SUCCESS, isLiked};
  }
}
module.exports = ArticleController;