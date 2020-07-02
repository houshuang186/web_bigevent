

$(function () {


    const layer = layui.layer
    const form = layui.form
    initArtCateList()

    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加按钮绑定点击事件
    var indexAdd = null//后面关闭弹出层需要用到（预先保存弹出层的索引，方便进行关闭）
    $('#btnAddCate').on('click', function () {
        //通过layer.open实现弹出层效果
        indexAdd = layer.open({
            //layer.msg layer.confirm layer.open 模态框
            type: 1,//类型：页面层
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理（事件委托）的形式，为 form-add 表单动态绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                //根据索引，关闭对应的弹出层  layer.open的返回值是一个索引
                layer.close(indexAdd)
            }
        })
    })
    //通过 事件委派 的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null//layer.open返回值是一个索引
    $('tbody').on('click', '.btn-edit', function () {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        //在展示弹出层之后，点击编辑按钮时根据data-id属性获取当前id值(当前name和alias在数据库中的id值，第一次发起文章列表请求时就会获得所有name的id值)，根据 id 的值发起请求获取文章分类的数据(res.data)，并填充到表单中(type=hidden隐藏域中)
        //debugger
        var id = $(this).attr('data-id')
        //发起请求获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 对表单进行赋值操作 
                form.val('form-edit', res.data)
                //debugger
            }

        })
    })

    //更新文章分类的数据  通过 事件委派 的方式，给修改按钮绑定点击事件
    $('body').on('submit', '#form-edit', function (e) {
        console.log($(this).serialize())
        debugger
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                //关上弹出层
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        //debugger

        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {

                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})