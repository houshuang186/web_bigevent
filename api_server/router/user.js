//在此文件中写与用户注册和登录相关的代码，并且只存放客户端的请求与处理函数之间的映射关系
//在router_handler 文件夹，用来存放所有的 路由处理函数模块(模块化)



const express = require('express')
const router = express.Router()


//导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

//导入验证表单数据的中间件
const expressjoi = require('@escook/express-joi')
//导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

//注册新用户
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser',  expressjoi(reg_login_schema), userHandler.reguser)


//登录
router.post('/login', expressjoi(reg_login_schema), userHandler.login)

module.exports = router