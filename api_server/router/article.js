//文章的路由模块
const express = require('express')
const router = express.Router()

//导入解析 formdata 格式表单数据的包
const multer = require('multer')
//导出处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')

//
const expressJoi = require('@escook/express-joi')
const { add_article_schema, get_list_schema, delete_statics_schema } = require('../schema/article')
//发布新文章的路由
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
// 注意：在当前的路由中，先后使用了两个中间件：
//       先使用 multer 解析表单数据
//       再使用 expressJoi 对解析的表单数据进行验证
router.post('/add', [upload.single('cover_img'), expressJoi(add_article_schema)], article_handler.addArticle)

//获取文章的列表数据的路由
router.get('/list', expressJoi(get_list_schema), article_handler.getListArticle)

//根据id删除文章数据的路由
router.get('/delete/:id', expressJoi(delete_statics_schema), article_handler.deleteStaticsById)

//思路错误
//首先获取文章列表数据，获取成功后跳转到文章发布页面进行修改
// //根据id获取文章详情数据的路由
// router.get('/:id', expressJoi(get_cate_schema), artcate_handler.getDetailsById)

// // //根据 id 更新文章详情数据 的路由
// router.post('/edit', expressJoi(update_cate_schema), artcate_handler.updateDetailsById)


module.exports = router