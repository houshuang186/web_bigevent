// jquery入口函数
$(function () {
    getUserInfo()
})

//获取用户的基本信息
const layer = layui.layer
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //heads就是请求头配置对象
        // headers: {
        //     Authorization:localStorage.getItem('token')||''
        // },
        success: function (res) {
            //console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            //调用renderAvatar渲染用户的头像
            renderAvatar(res.data)
        },
        // //不论成功还是失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     // console.log('执行了 complete 回调：')
        //     // console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空 token
        //         localStorage.removeItem('token')
        //         //2.强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}
//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的名称(nickname优先级比username高)
    var name = user.nickname || user.username
    //2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1渲染图片头像
        $('.lay-ui-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('text-avatar').html(first).show()
        
    }
}
//点击按钮，实现退出功能
$('#btnLogout').on('click', function () {
    //console.log('ok') 确定绑定事件是否成功
    //提示用户是否确认退出
    layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
        //do something
        //console.log('ok')
        //1.清除本地储存中的token
        localStorage.removeItem('token')
        //2.重新跳转到登录页面
        location.href = '/login.html'

        //关闭confirm询问框
        layer.close(index)
    })
})
