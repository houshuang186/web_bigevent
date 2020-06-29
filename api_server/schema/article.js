// 导入定义验证规则的模块
const joi = require('@hapi/joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1)
const content = joi.string().required().allow('')
//invalid 无效的 valid有效的
const state = joi.string().valid('已发布', '草稿').required()

//验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    }
}