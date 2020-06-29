
const path = require('path')

const db = require('../db/index')
// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    //console.log(req.body)// 文本类型的数据
    //console.log('--------分割线----------')
    //filedname 字段名；字段代码；验证的是formdata格式的数据
    console.log(req.file)// 文件类型的数据
    //res.send('ok')
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    const articleInfo = {
        //标题、内容、状态、所属的分类ID
        ...req.body,
        //文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        //文章发布时间
        pub_date: new Date(),
        //文章作者的ID
        author_id: req.user.id//需要登录授权的那个id
    }
    const sql = 'insert into ev_articles set ?'
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败')
        res.cc('发布文章成功')
    })

}