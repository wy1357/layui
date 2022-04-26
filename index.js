function getUser() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: (res) => {
      console.log(res);

      let data = res.data
      getImg(data)
      getInfo(data)

    },
  })
}
//获取用户头像
function getImg(data) {
  if (data.user_pic !== null) {
    // 头部区域
    $('#header-avatar').html(`<img src="${data.user_pic}" class="layui-nav-img">
    <span class="iconfont icon-personal">个人中心</span>`)
    // 侧边栏区域
    $('.user-info-box').html(`<img src="${data.user_pic}" class="layui-nav-img">
          <span class="welcome">&nbsp;欢迎&nbsp; ${data.nickname || data.username}</span>`)
  } else {
    // 头部区域
    $('#header-avatar').html(`<div class="text-avatar ">${data.username.slice(0,1)}</div>
    <span class="iconfont icon-personal">个人中心</span>`)
    // 侧边栏区域
    $('.user-info-box').html(` <div class="text-avatar">${data.username.slice(0,1)}</div>
    <span class="welcome">&nbsp;欢迎&nbsp; ${data.username}</span>`)
    if (data.nickname !== null) {
      // 头部区域
      $('#header-avatar').html(`<div class="text-avatar ">${data.nickname.slice(0,1)}</div>
      <span class="iconfont icon-personal">个人中心</span>`)
      // 侧边栏区域
      $('.user-info-box').html(` <div class="text-avatar">${data.nickname.slice(0,1)}</div>
    <span class="welcome">&nbsp;欢迎&nbsp; ${data.nickname}</span>`)
    }

  }
}
//获取基本资料
function getInfo(data) {
  layui.form.val('user-form', data)
}
$(function () {
  getUser()
  $('.slider a').on('click', function () {
    let id = $(this).attr('data-id')
    $('#' + id).show().siblings('.layui-body').hide()
    // if (id === "checkImg") {

    // } else if (id === "text") {
    //   // 1. 初始化图片裁剪器
    //   var $image = $('#image')

    //   // 2. 裁剪选项
    //   var options = {
    //     aspectRatio: 400 / 280,
    //     preview: '.img-preview'
    //   }

    // }
    // // 3. 初始化裁剪区域
    // $image.cropper(options)
  })
  $('.logout').on('click', function () {
    layer.confirm('是否退出', {
      icon: 3,
      title: '提示'
    }, function (index) {
      localStorage.removeItem('token')
      window.location.href = './html/enter&register.html'
      layer.close(index)
    })
  })
  layui.form.verify({
    nickname: [/^\S{1,10}$/, '昵称的长度为1-10的非空字符串'],
    pwd: function (e) {
      let oldPass = $('#formUpdatePwd [name=old_pwd]').val()
      if (e == oldPass) {
        return '新旧密码不能一致'
      }
    },
    repwd: function (e) {
      let newPass = $('#formUpdatePwd [name=re_pwd]').val()
      if (e !== newPass) {
        return '新密码输入不一致'
      }
    }, //分类名称
    name: [/^\S{1,10}$/, '分类名称必须是1-10位的非空字符串'],
    //分类别名
    alias: [/^[a-zA-Z0-9]{1,15}$/, '分类别名必须是1-15位的字母和数字']
  })

  //监听用户资料修改的表单提交
  $('#updateData').on('submit', function (event) {
    event.preventDefault()
    $.ajax({
      method: 'post',
      url: '/my/userinfo',
      data: {
        id: $('.layui-form [name=id]').val(),
        nickname: $('.layui-form [name=nickname]').val(),
        email: $('.layui-form [name=email]').val(),
      },
      success: function (res) {
        if (res.status == 0) {
          layer.msg(res.message)
        }
      }
    })
  })
  $('[type="reset"]').on('click', function (event) {
    event.preventDefault()
    getUser()
  })
  $('#formUpdatePwd').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'post',
      url: '/my/updatepwd',
      data: {
        oldPwd: $('#formUpdatePwd [name=old_pwd]').val(),
        newPwd: $('#formUpdatePwd [name=re_pwd]').val()
      },
      success: (res) => {
        console.log(res);
        if (res.status == 1) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        localStorage.removeItem('token')
        setTimeout(function () {
          window.location.href = '../html/enter&register.html'
        }, 500)
      }
    })
  })
  //监听选择图片的按钮
  $('#btnChooseImg').on('click', function (e) {
    e.preventDefault()
    //模拟点击
    $('#file').click()
  })
  let file = null

  $('#file').on('change', function (e) {
    // 1.1 获取裁剪区域的 DOM 元素  
    let $image = $('#image')
    const options = {
      //纵横比
      aspectRatio: 1,
      //指定预览区域
      preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    //获取选择的文件
    const files = e.target.files
    if (files.length == 0) {
      return layer.msg('请上传图片')
    }
    file = files[0]
    //创建对应的url地址
    url = URL.createObjectURL(file)
    $image
      .cropper('destroy') //销毁旧的裁剪区域
      .attr('src', url) //重新设置图片路径
      .cropper(options) //重新初始化裁剪区域
  })
  //监听上传头像按钮
  $('#btnUploadImg').on('click', function (e) {
    e.preventDefault()
    //判断是否有图片
    if (!file) {
      return layer.msg('请选择头像')
    }

    var dataURL = $image
      .cropper('getCroppedCanvas', {
        width: 100,
        height: 100
      })
      .toDataURL('image/png')
    $.ajax({
      method: "post",
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: (res) => {
        console.log(res);
        if (res.status == 0) {
          getUser()
          return layer.msg(res.message)
        }
      }
    })

  })
  cataList()
  //数据初始化
  function cataList() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      data: {},
      success: (res) => {
        let tmp = template('news_type', res)
        $('.title_type tbody').html(tmp)
      }
    })
  }
  //渲染文章列表数据
  function getCheck() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      data: {},
      success: (res) => {
        console.log(res);
        let tmp = template('select-title', res)
        $('#text [name="cate_id"]').html(tmp)
        //更新表单渲染
        layui.form.render()
      }
    })
  }
  //监听添加分类按钮
  let addCont = null;
  //监听修改按钮
  let updateCont = null;
  $('#btnShowAdd').on('click', function () {
    //使用弹出层
    addCont = layer.open({
      type: 1, //基本层类型
      title: '添加文章分类', //标题
      area: ['500px', '250px'], //给弹出层设置宽高
      content: $('#template-add').html() //添加引擎模板
    })
  })

  //全局监听确认添加的表单提交
  $('body').on('submit', '#form-add', function (event) {
    event.preventDefault()
    $.ajax({
      method: 'post',
      url: '/my/article/addcates',
      data: {
        name: $('.layui-form [name="name"]').val(),
        alias: $('.layui-form [name="alias"]').val()
      },
      success: (res) => {
        console.log(res);
        if (res.status == 0) {
          layer.msg(res.message)
          //关闭弹出层
          layer.close(addCont)
          cataList()
        }

      }
    })
  })

  $('tbody').on('click', '.updateInfo', function () {
    let id = $(this).attr('data-id')
    //使用弹出层
    updateCont = layer.open({
      type: 1, //基本层类型
      title: '修改文章分类', //标题
      area: ['500px', '250px'], //给弹出层设置宽高
      content: $('#template-edit').html() //添加引擎模板
    })
    $.ajax({
      url: '/my/article/cates/' + id,
      method: 'get',
      success: (res) => {
        console.log(res);

        if (res.status == 0) {
          layui.form.val('form-update', res.data)
          layer.msg(res.message)
        }
      }
    })
  })
  //监听确认修改按钮
  $('body').on('submit', '#form-edit', function (event) {
    event.preventDefault()
    console.log($(this).serialize());
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: (res) => {
        console.log(res);
        if (res.status == 0) {
          layer.msg(res.message)
          //关闭弹出层
          layer.close(updateCont)
          cataList()
        }

      }
    })
  })
  //删除数据
  $('tbody').on('click', '.deleteInfo', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除吗?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/' + id,
        success: (res) => {
          if (res.status == 0) {
            layer.msg(res.message)
            cataList()
          }
        }
      })
      layer.close(index)
    })

  })
  //监听重置按钮，将当前数据清空
  $('#cate_reset').on('click', function (e) {
    e.preventDefault()
    $('.layui-form [name="name"]').val('')
    $('.layui-form [name="alias"]').val('')
  })
  getCheck()
  let state = '已发布'
  $('.select_cover').on('click', function (e) {
    e.preventDefault()
    $('#text #file').click()
  })
  // 1. 初始化图片裁剪器
  let $image = $('#images')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  $('#text #file').on('change', function (e) {
    e.preventDefault()

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //获取选择的文件
    const files = e.target.files
    if (files.length == 0) {
      return layer.msg('请上传图片')
    }
    file = files[0]
    //创建对应的url地址
    url = URL.createObjectURL(file)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', url) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  $('#test').on('submit', '#news_publish', function (e) {
    e.preventDefault()
    let fd = new FormData($(this)[0])
    
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
      })
    fd.append('state', state)
    console.log(fd);
    $.ajax({
      method: 'post',
      url: '/my/article/add',
      data: fd,
      // 发送的数据类型
      contentType: false,
      // 对 formData 进行解析 
      processData: false,
      success: (res) => {
        console.log(res);
      }
    })
    $.ajax({
      method:'get',
      url:'/my/article/list',
      data:{
        pagenum:1,
        pagesize:12
      },
      success:(res)=>{
        console.log(res);
        if(res.status==0) {
          layer.msg(res.message)
        }
      }
    })
  })
  $('.publish').click(function () {
    state = '已发布'
  })
  $('.cg').click(function () {
    state = '草稿'
  })
  
})