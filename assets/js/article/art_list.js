
$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    //debugger
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据 告诉服务器要第几页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条  告诉服务器要的列表一页多少条
    cate_id: '', // 文章分类的 Id   筛选条件：哪个分类里面的（cate_id从文章类别的name中获取）
    state: '' // 文章的发布状态      筛选条件：已发布和草稿这两个状态
  }

  initTable()
  initCate()

  let artCateList //全局变量，每个函数作用域均可访问
  let allNumber = 0
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        //console.log(res)
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }

        res.data.forEach(item => {
          const article = artCateList.find(cate => cate.id === item.cate_id)
          if (article) {
            item.cate_name = article.name
          }
        });
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        allNumber = res.total
        // 当表格被渲染完成后（模板引擎渲染完数据后）调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        //console.log(res)
        const { data } = res
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)

        // 通过 layui 重新渲染表单区域的UI结构
        form.render()

        //把数据data中的某些属性传给initTable()
        artCateList = data
        initTable()//获取文章列表； 再调用一次，不加也无影响
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()

    //合并对象 Object.assign //合并
    //取出运算符      //合并

    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state


    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器（在HTML中有一个div容器）的 Id  告诉layui分页组件往哪渲染
      count: total, // 总数据条数  需要自己主动告诉分页组件总数
      // 查询的参数对象q 中已经设置pagesize和pagenum的值
      limit: q.pagesize, // 每页显示几条数据  限制每页显示多少条
      curr: q.pagenum, // 设置默认被选中的分页  当前页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//'count'字符串分页中显示共多少条  按照书写顺序在页面中显示内容
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 方式1. 点击页码的时候，会触发 jump 回调 和死循环无关系
      // 方式2. 只要调用了 laypage.render() 方法，分页发生切换时就会触发 jump 回调  会导致jump死循环 
      jump: function (obj, isfirst) {
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调,应该调用initTable()
        // 如果 first 的值为 true，证明是方式2触发的，不应该调用initTable()
        // 否则就是方式1触发的
        //console.log(isfirst) //布尔值命名is
        //console.log(obj.curr)//拿到最新的页码值
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中

        q.pagesize = obj.limit
        // 根据最新的 q 获取对应的数据列表，并渲染表格

        // initTable()  //回调中包含着一个回调，会进入死循环,超出最大调用次数，爆栈 jump回调中调用了iniTable()
        if (!isfirst) {
          initTable()
        }
      }
    })
  }

  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数  -》判断页面上是否有数据，没有数据时把页码数删掉
    var len = $('.btn-delete').length
    //debugger
    console.log(len)
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          // if (len === 1) {
          //   // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
          //   // 页码值最小必须是 1
          //   q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          // }
          // //debugger
          // console.log(q.pagenum)
          if (q.pagenum * q.pagesize === allNumber + 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }

          //重新加载表格数据
          initTable()
        }
      })

      layer.close(index)
    })
  })

  //编辑文章列表分类
  //通过事件委托的形式，为编辑按钮绑定点击事件
  let indexedit = null
  $('tbody').on('click', '.btnedit', function () {
    //弹出一个修改文章分类信息的层
    indexedit = layer.open({
      type: 1,
      area: ['600px', '300px'],
      title: '修改文章分类列表',
      content: $('#list-edit').html()
    })
    //在展示弹出层之后，根据id的值发起请求获取文章分类列表的数据，并填充到表单中
    var id = $(this).attr('data-id')
    //发起ajax请求获取对应的分类数据
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })

  //更新文章分类列表  通过 事件委派 的方式，给修改按钮绑定点击事件,#form-edit是标签的id（修改编辑弹出层的稳定父元素是body）
  $('body').on('submit', '#form-edit', function (e) {
    //button按钮有lay-submit属性时，form表单有默认的提交属性，比如get请求方式，需要阻止
    //input输入框type=submit属性也有默认提交
    //input输入框 type=button无默认提交属性，发起请求时一般不会这样写，button标签使用最多
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: $(this).serialize(),//收集x-www-form-url-enconded格式的数据，得到key=value&key=value格式的数据
      success: function (success) {
        if (res.status !== 0) {
          return layer.msg('更新列表数据失败！')
        }
        layer.msg('更新列表数据成功！')
        //关上弹出层
        layer.close(indexedit)
        //初始化文章列表数据
        initTable()
      }
    })
  })

})
