//这是文章分类的路由模块

const express = require('express')

const router = express.Router()

//导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate')

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入文章分类, 删除文章，根据ID获取分类, 根据ID更新文章分类 的验证模块 解构赋值 按需导入
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

//获取文章分类的列表数据
router.get('/cates', artcate_handler.getArticleCates)

//新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)

//删除文章分类的路由 验证的时候需要在params的id里面添加值
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

//根据id获取文章分类的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)

//根据 Id 更新文章分类数据 的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)


module.exports = router
