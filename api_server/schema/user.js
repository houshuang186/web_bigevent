const joi = require('@hapi/joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * //required在表单中表示必填项
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

//用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
 //密码的验证规则  [\S]表示不能有空字符 {6,12}6-12位 ^开始 $结束 
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

//定义 id, nickname, email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()


//定义更换头像的验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()



//注册和登录表单的验证规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

//验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email,
    },
}

//验证规则对象-更新密码
exports.update_password_schema = {
    body: {
        oldPwd: password,
        //ref一般表示引用
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    }
}

//验证规则对象-更换头像
exports.update_avatar_schema = {
    body: {
        avatar,
    },
}
