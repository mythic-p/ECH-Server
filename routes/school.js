const express = require('express');
const router = express.Router();
const SchoolController = require('../controllers/school_controller');
// 获取指定学校的名称
// GET: /school/:id
// id: {必填} 学校的ID
router.get('/:id', async (req, res) => {
  const {code, msg, school} = await SchoolController.GetSchoolById(req.params.id);
  res.mpJson(code, msg, school);
});
// 添加一所新学校
// POST: /school/
// name: {必填} 新学校的名称
router.post('/', async (req, res) => {
  const {code, msg} = await SchoolController.AddSchool(req.params.name);
  res.mpJson(code, msg);
});

module.exports = ['/school', router];