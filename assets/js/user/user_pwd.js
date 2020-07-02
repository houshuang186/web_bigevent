const form = layui.form

$(function () {

    // 为修改密码的表单自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }

    })


})

// const layer = layui.layer
// const inputbody3 = form.val('formUserInfo')//取值
//     delete inputbody3.rePwd
//     console.log(inputbody3)

//提交form表单实现重置密码的功能
$('.layui-form').on('submit', function (e) {
    //阻止表单的默认行为
    e.preventDefault()
    //发起ajax请求
    //console.log(this)

    //发起ajax请求时提交表单时剔除某个不需要提交的属性 法3 进行字符串的拼接
    // // $(this).serialize()得到的格式都是key=value&key=value的形式，需要对字符串进行拼接操作将rePwd剪掉，而delete方法操作的是对象格式的数据

    // const inputparams = $(this).serialize()
    // const inputparams1 = inputparams.split('&')
// ----------------------
    //params.length = 2 //取数组的前两项
    //params = 0和params = []为清空数组
// ---------------------
    // const index = inputparams1.findIndex(item => item.includes('rePwd'))
    // const inputparams2 = inputparams1.splice(index, 1)
    // const inputparams3 = inputparams1.join('&')
    //console.log(inputparams3)

    // //console.log('删之前' + inputparams)
    // //字符串不能用delete方法，对象可用
    // //delete inputparams.rePwd
    // //console.log(inputparams)
    //-----------------------------------------

    //发起ajax请求时提交表单时剔除某个不需要提交的属性 法1
    // form.val('formUserInfo', res.data)//拿不到提交的数据
    // //----------------------------

    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        //data: inputparams3,
        data: $(this).serialize(),
        success: function (res) {
            //console.log(res)//status和message
            // form.val('formUserInfo', res.data)//拿不到提交的数据

            if (res.status !== 0) {
                return layer.msg('更新密码失败!')
            }
            layer.msg('更新密码成功!')
            //重置表单  $('.layui-form')[0]把jQuery对象转换成dom对象，才能用原生的reset方法
            $('.layui-form')[0].reset()
        }
    })
})