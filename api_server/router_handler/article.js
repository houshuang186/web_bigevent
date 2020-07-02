
const path = require('path')

const db = require('../db/index')
// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    //console.log(req.body)// 文本类型的数据
    //console.log('--------分割线----------')
    //filedname 字段名；字段代码；验证的是formdata格式的数据
    //console.log(req.file)// 文件类型的数据
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
    console.log(req.body)
    const sql = 'insert into ev_articles set ?'
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败')
        res.cc('发布文章成功',0)//******* */
    })

}

//获取文章的列表数据的处理函数
// exports.getListArticle = (req, res) => {
//     //res.send('ok')
//     //
//     const sql = 'select * from ev_articles where is_delete = 0 and cate_id= ? and state=?';
//     const { cate_id, state } = req.query
//     //console.log(req.query)
//     //执行sql语句获取文章分类列表
//     db.query(sql, [cate_id, state], (err, results) => {
//         if (err) return res.cc(err)
//         // if(results.length == 0) return res.cc('获取文章分类列表失败')//不需要这行代码，因为刚开始获取的时候就是空的，只有筛选过以后才有数据
//         //
//         res.send({
//             status: 0,
//             message: '获取文章列表成功',
//             data: results
//         })

//     })
// }
exports.getListArticle = (req, res) => {
    let obj = req.query
    let sql = `select * from ev_articles where is_delete = 0 and 1 = 1`;
    let total = 0
    obj.pagesize = obj.pagesize || 2;
    console.log(obj)

    if (obj.cate_id) { sql = sql + ` and cate_id='${obj.cate_id}'`; }
    if (obj.state) { sql = sql + ` and state='${obj.state}'`; }
    //` 此处有空格，和前面拼接时需要空格 limit ${(obj.pagenum - 1) * obj.pagesize}, ${obj.pagesize}`
    sql = sql + ` limit ${(obj.pagenum - 1) * obj.pagesize}, ${obj.pagesize}`;
    console.log(sql)
    db.query(sql, (err, results) => {
        console.log(results)
        if (err) return res.cc(err)
        let sql = `select count(*) as total from ev_articles where is_delete = 0 and 1=1`;
        if (obj.cate_id) { sql = sql + ` and cate_id='${obj.cate_id}'`; }
        if (obj.state) { sql = sql + ` and state='${obj.state}'`; }
        db.query(sql, (err, results1) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: results,
                total: results1[0].total
            })
            console.log(total)
        })
    })
}

////根据id删除文章数据的处理函数
exports.deleteStaticsById = (req, res) => {
    const sql = 'update ev_articles set is_delete = 1 where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
        //删除文章分类成功
        res.cc('删除文章分类成功', 0)

    })
}

//思路错误
// //根据id获取文章详情数据的路由
// exports.getDetailsById = (req, res) => {
//     const sql = 'select * from ev_articles where id = ?'
//     db.query(sql, req.params.id, (err, results) => {
//         if (err) return res.cc(err)
//         if (results.length !== 1) return res.cc('获取文章分类失败！')
//         res.send({
//             status: 0,
//             message: '获取文章分类列表成功！',
//             data:results[0]
//         })
//     })
// }

// //根据 id 更新文章详情数据 的路由
// exports.updateDetailsById = (req, res) => {
//   const sql = `select * from ev_articles where id<>? and (name=? or alias=?)`
// }
