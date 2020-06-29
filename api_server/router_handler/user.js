//导入数据库
const db = require('../db/index')

//导入brcrptjs
const bcrypt = require('bcryptjs')

//导入jsonwebtoken包
const jwt = require('jsonwebtoken')

//导入配置文件
const config = require('../config/index')
const { jwtSecretKey, expiresIn } = config
//注册新用户
exports.reguser = (req, res) => {

    const userinfo = req.body
    //console.log(userinfo)
    let { username, password } = req.body //解构
    //用户名和密码非空，joi和express-joi更完整
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, msg: '用户名或密码不能为空'})
    // }

   
      
    //res.send('reguser ok') //异步？？？res.send是同步执行，db.query是异步执行
    //检测用户名是否可用
    const sql = 'select * from ev_users where username=?'
    //let {username} = {username: userinfo.username} //解构？用let还是const
    db.query(sql, [username], function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
          //return res.send({ status: 1, message: err.message })
          return res.cc(err)
        }
        // 用户名被占用（results是个数组）
        if (results.length > 0) {
          //return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
          return res.cc('用户名被占用，请更换其他用户名！' )
        }
        // TODO: 用户名可用，继续后续流程...
        //调用bcrypt对密码进行加密
        password = bcrypt.hashSync(password, 10)

        //定义插入新用户的SQL语句
        const sqlin = 'insert into ev_users set ?' 
        //调用db.query()执行SQL语句
        db.query(sqlin, { username, password }, (err, results) => {
            //判断SQL语句执行是否成功
            //if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)

            //判断影响行为数是否为1
            //if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试' })
            if (results.affectedRows !== 1) return res.send('注册用户失败，请稍后再试' )
            
            //注册用户成功
            res.cc('注册成功', 0)
        })


      })
}



//登录
exports.login = (req, res) => {
    
    //接收表单数据
    const { username, password} = req.body
    //定义sql语句
    const sqllogin = 'select * from ev_users where username=?'
    //执行sql语句
   db.query(sqllogin, username, (err, results) => {
    //执行SQL语句失败
    if (err) return res.cc(err)
    //执行SQL语句成功，但查询到数据条数不等于1
     if (results.length !== 1) return res.cc('登录失败')
     //res.send('login ok')//判断登录成功能否执行
    // TODO：判断用户输入的登录密码是否和数据库中的密码一致
    //拿着用户输入的密码，和数据库中存储的密码进行对比
     const compareResult = bcrypt.compareSync(password, results[0].password)

     //如果对比的结果等于false, 则证明用户输入的密码错误
     if (!compareResult) {
       return res.cc('登录失败')
     }
     //密码一致，验证通过在服务器端生成 token字符串
     const user = { ...results[0], password: '', user_pic: '' }
     //对用户的信息进行加密，生成token字符串
     //const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: '10h'}) 
     const tokenStr = jwt.sign(user, jwtSecretKey, {expiresIn}) 
     res.send({
       status: 0,
       message: '登录成功！',
       //为了方便客户端使用token， 在服务器端直接拼接上Bearer的前缀
       //token: 'Bearer ' + tokenStr,
       token: `Bearer ${tokenStr}`

    })
   })
}