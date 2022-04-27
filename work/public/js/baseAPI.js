// 配置请求根路径
$.ajaxPrefilter(function (opt) {
  opt.url = 'http://www.liulongbin.top:3007' + opt.url
  if (opt.url.indexOf('/my/') !== -1) {
    opt.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  opt.complete = function (e) {
    let value = e.responseJSON
    if (value.status !== 0) {
      layer.msg('获取用户信息失败')
      setTimeout(() => {
        window.location.href = "../html/enter&register.html"
      }, 3000)
    }
  }
})