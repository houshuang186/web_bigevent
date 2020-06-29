//导入数据库操作模块
const db= require('../db/index')



//获取文章分类列表数据的处理函数 get/query
exports.getArticleCates = (req, res) => {
    //res.send('ok')   
    //定义SQL语句
    //根据分类的状态，获取所有未被删除的分类列表数据‘
    //is_delete表示没有被标记为删除的数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    //执行
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章成功',
            data: results,
        })
    })
}

//新增文章分类的处理函数 add
exports.addArticleCates = (req, res) => {
    //res.send('ok')
    //首先查询分类名称与别名是否被占用
    //定义查重的SQL语句
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    //执行SQL语句进行查重
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //分类名称和分类别名都被占用
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('分类名称与别名被占用，请更换后重试')    
        
        //分类名称或分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试')

        //查重通过，新增文章分类
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败')
            res.cc('新增文章分类成功', 0)
        })
    
    
    })
}

//删除文章分类的处理函数  delete orderby  标记删除/软删除/逻辑删除
exports.deleteCateById = (req, res) => {
    //res.send('ok')
    const sql = 'update ev_article_cate set is_delete = 1 where id =?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
        //删除文章分类成功
        res.cc('删除文章分类成功', 0)
    })
}

//根据id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    //res.send('ok')
    //实现获取文章分类的功能
    const sql = 'select * from ev_article_cate where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类数据失败')
        //查询成功，把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类成功',
            data: results[0]
        })
    })
}

//根据ID更新文章分类的路由处理函数
exports.updateCateById = (req, res) => {
    //res.send('ok')
    //查询分类名称与别名是否被占用
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    //const sql = 'select * from ev_article_cate where Id<>？and (name=? or alias=?)'
    const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
    const { id, name, alias } = req.body
    
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        
        if (err) return res.cc('执行SQL语句失败'+ err)
        
        if (results.length === 2) return res.cc('分类名称和分类别名被占用，请重试')

        if (results.length === 1) {
            const { name: cName, alias: cAlias } = results[0]
            if (cName === name && cAlias === alias) return res.cc('分类名称和分类别名被占用，请重试')
            if (cName === name) return res.cc('分类名称别占用，请重试')
            if (cAlias === alias) return res.cc('分类别名别占用，请重试')
        }
        //查重通过，实现更新文章分类
        const sql1 = 'update ev_article_cate set? where Id=?'
        db.query(sql1, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败')
            res.cc('更新文章分类成功', 0)
        })
    })
}
// exports.updateCateById = (req, res) => {
//     // 定义查重的 SQL 语句
//     const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
//     // 调用 db.query() 执行查重的 SQL 语句
//     db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
//       // 执行 SQL 语句失败
//       if (err) return res.cc(err)
  
//       // 判断名称和别名被占用的4种情况
//       if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
//       if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
//       if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
//       if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
//       // 定义更新文章分类的 SQL 语句
//       const sql = `update ev_article_cate set ? where Id=?`
//       // 执行更新文章分类的 SQL 语句
//       db.query(sql, [req.body, req.body.Id], (err, results) => {
//         if (err) return res.cc(err)
//         if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
//         res.cc('更新文章分类成功！', 0)
//       })
//     })
//   }