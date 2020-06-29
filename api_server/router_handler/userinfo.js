const db = require("../db/index")

// 导入处理密码的模块
const bcrypt = require('bcryptjs')

//获取用户信息的处理函数
exports.getuserinfo = (req, res) => {
    //res.send('ok')
    //定义查询用户信息的SQL语句   
    // const {id: userid} = req.user
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id =?'
    db.query(sql, req.user.id, (err, results) => {
        //sql语句执行失败
        if (err) return res.cc(err)
        
        if(results.length !== 1) return res.cc('获取用户信息失败')
        //获取用户信息成功
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0],
        })
    
    })
}

//更新用户信息的处理函数
exports.updateuserinfo = (req, res) => {
    //res.send('ok')
    //定义更新用户信息的SQL语句
    const sql = 'update ev_users set ? where id =?'
    //id还可以从req.user.id中获取（前面获取用户信息的处理函数中的req.user.id）
    //id需要在数据库中存在
    db.query(sql, [req.body, req.body.id], (err, results) => {
       //执行SQL语句失败
        if (err) return res.cc(err)

        //执行成功，但是影响行数不为1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败')
        //修改用户信息成功
        return res.cc('修改用户信息成功', 0)
    })

}

//重置密码的处理函数
exports.updatePassword = (req, res) => {
    //res.send('ok')
    //根据id查询用户信息
    const sql = 'select * from ev_users where id =?'
    
    //req.body.id需要在postman里面在body中输入id，而req.user1.id是从上面的token中获取，不需要再输入

    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('查询用户失败')
        if (results.length === 1) {
            //判断用户传入的密码和数据库里面的密码是否一致
            const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
            if (!compareResult) {
                return res.cc('旧密码错误')
            }
            //旧密码正确，进行更新操作
            const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
            const sql = 'update ev_users set password =? where id =?'
            //异步，需要嵌套
            db.query(sql, [newPwd, req.user.id], (err, results) => {
                if (err) return res.cc('更新密码失败')
                if (results.affectedRows === 1) {
                    res.cc('更新密码成功', 0)
                }
            })
        }
    })
}

//更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    //res.send('ok')
    //定义更新头像的sql语句
    const sql = 'update ev_users set user_pic=? where id=?'
    //执行sql语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //执行成功，但是影响行数不为1
        if(results.affectedRows !== 1) return res.cc('更新头像失败')
        //更新用户头像成功
        return res.cc('更新头像成功',0)
    })
}