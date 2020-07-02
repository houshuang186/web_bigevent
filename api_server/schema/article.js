// 导入定义验证规则的模块
const joi = require('@hapi/joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1)
const content = joi.string().required().allow('')
//invalid 无效的 valid有效的
const state = joi.string().valid('已发布', '草稿').required()

//定义删除文章分类数据的id
const id = joi.number().integer().min(1).required()


// //定义页码值和每页显示多少条数据的验证规则
// const pagenum = joi.number().required().integer()
// const pagesize = joi.number().required().integer()
//验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    }
}

//验证规则对象
exports.get_list_schema = {
    query: {
        pagenum:joi.number().required(),
        pagesize:joi.number().required(),
        cate_id:joi.allow(''),
        state:joi.allow('')
    }
}

//验证规则对象-删除文章数据
exports.delete_statics_schema = {
    params: {
        id,
    },
}