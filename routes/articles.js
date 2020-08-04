const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article_controller');

// 创建文章
// POST: /articles/
// uid: {必填} 文章所属的用户ID
// sid: {必填} 用户所属的学校ID
// title: {必填} 文章的标题 长度在1~25个字符之间
// desc: {必填} 文章的简介 长度在1~190个字符之间
// content: {必填} 文章的具体内容，支持h5标签，长度在1~2500个字符之间
// tags: {选填} 文章的标签，每个标签之间用|隔开
// availability: {必填} 文章的公开程度，具体参考文章控制器js文件中的说明
// cid: {必填} 文章所属的类别，具体参考文章控制器中的相关说明
router.post('/', async (req, res) => {
  const {uid, sid, title, desc, content, tags, availability, cid} = req.body;
  const {code, msg} = await ArticleController.CreateArticle(uid, sid, title, desc, content, tags, availability, cid);
  res.mpJson(code, msg);
});
// 获取指定类别和ID的文章
// GET: /articles/:id
// id: {必填} 要查找的文章ID
// cid: {必填} 要查找文章的所属文章类别
router.get('/:id', async (req, res) => {
  const {code, msg, article} = await ArticleController.GetArticleById(req.params.id, req.query.cid);
  res.mpJson(code, msg, article);
});
// 获取一组指定类别和排序规则的文章
// GET: /articles/
// cid: {必填} 批量获取的所有文章的所属类别
// page: {必填} 批量获取的当前页码
// size: {必填} 一次可最多批量获取的数量
// order: {必填} 批量获取遵循的排序规则
router.get('/', async (req, res) => {
  const {cid, page, size, order} = req.query;
  const {code, msg, articles} = await ArticleController.GetArticlesByCategoryId(cid, page, size, order);
  res.mpJson(code, msg, articles);
});
// 更新一个指定ID和类别的文章
// PUT: /articles/:id
// id: {必填} 被更新文章的ID
// cid: {必填} 被更新的文章的类别
router.put('/:id', async (req, res) => {
  const {cid, data} = req.body;
  const {code, msg} = await ArticleController.UpdateArticleById(req.params.id, cid, data);
  res.mpJson(code, msg);
});
// 用户对指定文章进行点赞/取消点赞操作
// POST: /articles/:aid/like
// aid: {必填} 被操作的文章ID
// uid: {必填} 操作用户ID
// cid: {必填} 文章类别
// like: {必填} 点赞操作/取消点赞操作
router.post('/:aid/like', async (req, res) => {
  const {uid, cid, like} = req.body;
  const {code, msg} = await ArticleController.SetArticleLikeById(uid, req.params.aid, cid, like);
  res.mpJson(code, msg);
});
// 获取请求用户对指定文章的点赞情况
// GET: /articles/:aid/like
// aid: {必填} 文章ID
// cid: {必填} 文章类别
// uid: {必填} 请求用户的ID
router.get('/:aid/like', async (req, res) => {
  const {uid, cid} = req.query;
  const {code, msg, isLiked} = await ArticleController.GetArticleLikeById(req.params.aid, cid, uid);
  res.mpJson(code, msg, isLiked);
});
// 用户对指定文章进行收藏/取消收藏操作
// POST: /articles/:aid/fav
// aid: {必填} 被操作的文章ID
// uid: {必填} 操作用户的ID
// cid: {必填} 文章类别
// fav: {必填} 收藏/取消收藏操作
router.post('/:aid/fav', async (req, res) => {
  const {uid, cid, fav} = req.body;
  const {code, msg} = await ArticleController.SetArticleFavById(req.params.aid, cid, uid, fav);
  res.mpJson(code, msg);
});
// 获取请求用户对指定文章的收藏情况
// GET: /articles/:aid/fav
// aid: {必填} 文章ID
// uid: {必填} 请求用户的ID
// cid: {必填} 文章类别
router.get('/:aid/fav', async (req, res) => {
  const {uid, cid} = req.query;
  const {code, msg, isFavorited} = await ArticleController.GetArticleFavById(req.params.aid, cid, uid);
  res.mpJson(code, msg, isFavorited);
});
// 获取指定文章下的评论
// GET: /articles/:aid/comments
// aid: {必填} 文章ID
// cid: {必填} 文章类别
// page: {必填} 批量查询的当前页码
// size: {必填} 一次最多可查询到的数量
// order: {必填} 批量查询依据的排序规则编号
router.get('/:aid/comments', async (req, res) => {
  const {cid, page, size, order} = req.query;
  const {code, msg, comments} = await ArticleController.GetCommentsById(req.params.aid, cid, page, size, order);
  return res.mpJson(code, msg, comments);
});
// 向指定文章添加一条评论
// POST: /articles/:aid/comments
// aid: {必填} 文章ID
// cid: {必填} 文章类别
// uid: {必填} 发送评论的用户ID
// content: {必填} 评论的内容，长度为1~200个字符
router.post('/:aid/comments', async (req, res) => {
  const {uid, cid, content} = req.body;
  const {code, msg} = await ArticleController.AddComment(req.params.aid, cid, uid, content);
  res.mpJson(code, msg);
});
// 对指定文章的指定一条评论进行点赞/取消点赞操作
// POST: /articles/:aid/comments/:cid/like
// aid: {必填} 文章ID
// cid (URL中的): {必填} 评论ID
// cid: {必填} 文章类别
// uid: {必填} 操作用户的ID
// like: {必填} 点赞/取消点赞操作
router.post('/:aid/comments/:cid/like', async (req, res) => {
  const {uid, cid, like} = req.body;
  const {code, msg} = await ArticleController.SetCommentLikeById(req.params.cid, req.params.aid, cid, uid, like);
  res.mpJson(code, msg);
});
// 查看请求用户对指定文章的指定评论的点赞情况
// GET: /articles/:aid/comments/:cid/like
// aid: {必填} 文章ID
// cid (URL): {必填} 评论ID
// cid: {必填} 文章类别
// uid: {必填} 用户ID
router.get('/:aid/comments/:cid/like', async (req, res) => {
  const {uid, cid} = req.query;
  const {code, msg, isLiked} = await ArticleController.GetCommentLikeById(req.params.cid, req.params.aid, cid, uid);
  res.mpJson(code, msg, isLiked);
})

module.exports = ['/articles', router];