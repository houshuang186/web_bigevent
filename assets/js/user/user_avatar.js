$(function () {
    const layer = layui.layer


    //1.1获取裁剪区域的DOM元素
    var $image = $('#image')

    //1.2配置选项
    const options = {
        //纵横比
        aspectRatio: 1,
        //指定预览区域
        preview: '.img-preview'
    }

    //1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        //模仿上传文件的点击行为
        $('#file').click()
    })

    // 为文件选择框绑定change事件 当用户选择了某一张图片，自动触发这个change事件
    $('#file').on('change', function (e) {
        // console.log(e)
        //获取用户选择的文件 target:当前目标元素 属性 方法
        var filelist = e.target.files

        //伪数组
        //Array.isArray(files) 判断是不是一个数组；返回一个布尔值
        //转换成真正的数组：取出运算符 [...files]  2.Array.from(files)
        //[...files].forEach()

        // if (Array.from(files).length === 0) {
        //     return '请选择图片'
        // }
        
        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        }

        //1.拿到用户选择的文件
        var file = e.target.files[0]
        //2.将文件转化为路径  URL.createObjectURL(file)原生api
        var imgURL = URL.createObjectURL(file)
        //3.重新初始化裁剪区域
        $image
            .cropper('destroy')// 销毁旧的裁剪区域
            .attr('src', imgURL)// 重新设置图片路径
            .cropper(options)// 重新初始化裁剪区域
    })

    //为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        //1.要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
            //创建一个Canvas画布
                width: 100,
                height:100
            })
        .toDataURL('image/png')// 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //2.调用接口，把头像上传到服务器  base64格式字符串 比较多 不需要联网（体积大， 减少不必要的图片请求）小图片可以转换成base64格式，大图片没必要，base64格式比原文件大30%左右
    //base64格式：data:image/png; base64 asdfhjjklhhgyuudh
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function (res) {
                // debugger
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})
