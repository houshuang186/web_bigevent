//引入jQuery 入口函数
$(function () {
    //点击‘去注册账号’的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击‘去登录’的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //通过查阅文档，我们只要如果需要去自定义校验规则，我们先要得到form模块对象，从layUI中获取form对象
    const form = layui.form
    //从layUI中获取layer对象
    const layer = layui.layer
    //通过 form.verify() 函数自定义校验规则，里面是 key：value形式，key后续对应设置到标签的 lay-verity属性中，value就是验证的规则，这里定义了两个自定义校验规则，一个是密码框，利用的是正则，一个是确认密码
    form.verify({
        //自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位， 且不能出现空格'],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            //然后进行一次等于的判断
            //如果判断失败。则return一个提示消息即可
            const pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
    //1.阻止默认的提交行为
        e.preventDefault()
    //2.发起Ajax的post请求
        var data = {
        username:$('#form_reg [name = username]').val(),
        password:$('#form_reg [name = password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                //re
                //layer.msg - 提示框（弹出层）内置方法
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            //模拟人的点击行为 直接跳到登录页面（用程序模拟）
            $('#link_login').click()
        }
        )    
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                //将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = '/index.html'
            }
           
        })
    })
})