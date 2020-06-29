//校验个人中心基本资料表单数据
var form = layui.form

$(function () {
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
})

initUserInfo()
//初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //console.log(res)
            //调用 form.val() 方法为表单赋值
            form.val('formUserInfo', res.data)
        }
    })
}

//重置表单的数据 重新拉取用户信息
$('#btnReset').on('click', function (e) {
    //阻止表单的默认重置行为
    e.preventDefault()
    initUserInfo()
})

//发起请求更新用户的信息
//监听表单的提交事件
$('.layui-form').on('submit', function (e) {
    //阻止表单的默认提交行为
    e.preventDefault()
    //发起ajax请求数据
    //发起ajax请求时提交表单时剔除某个不需要提交的属性 法1
    // const inputParams = form.val('formUserInfo')//取值
    // //console.log(inputParams)
    // delete inputParams.username
    //console.log(inputParams)
    //----------------------------------

    //发起ajax请求时提交表单时剔除某个不需要提交的属性 法2
    //给username加disabled, $(this).serialize()会自动剔除它

    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        // data: inputParams,//法1

        data: $(this).serialize(),//法2更简单  $(this).serialize()会自动剔除有disableds属性的值
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('更新用户信息失败！')

            }
            layer.msg('更新用户信息成功')
            //调用父页面中的方法，重新渲染用户的头像和用户信息
            window.parent.getUserInfo()
        }
    })
})
