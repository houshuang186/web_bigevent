// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

const joi = require('@hapi/joi')
//1.2 1.3
const cors = require('cors')
const path = require('path')
app.use(cors())

app.use(express.urlencoded({ extended: false }))  //注意位置，要在所有路由之前

//托管静态资源文件
app.use("path.join(__dirname, '/uploads')", express.static("path.join(__dirname, './uploads')"))
//console.log(path.join(__dirname, '/uploads'))
//console.log(path.join(__dirname, './uploads'))

//响应数据的中间件
app.use((req, res, next) => {
    //status = 0为成功，status = 1为失败；默认将status的值设置为1，方便处理失败的情况
    //对函数1参数进行解构给默认值的时候，最后在最后一个参数
    res.cc = function (err, status = 1) {
        res.send({
            //状态
            status,
            //状态描述，判断err是错误对象还是字符串
            message: err instanceof Error ? err.message :err,  
        })
    }
    next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config/index')
const { jwtSecretKey, expiresIn } = config
app.use(expressJWT({ secret: jwtSecretKey }).unless({ path: [/^\/api/] }))


// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

//导入并使用用户路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
//为文章分类挂载统一的访问前缀
app.use('/my/article', artCateRouter)

//导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

//错误中间件
app.use(function (err, req, res, next) {
    //数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)//上面已经封装函数
      // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    //未知错误
    res.cc(err)
})
// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(80, () => {
console.log('http://127.0.0.1')
});
