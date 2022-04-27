$(function () {
    $('.item_reg').click(function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('.item_login').click(function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    layui.form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //判断两次输入的密码是否相同
            if (value !== $('.reg-box [name="password"]').val()) {
                return '两次密码不一致'
            }
        }
    })
    //监听注册
    $('.reg-box').on('submit', function (event) {
        //兼容性
        var event = event || window.event
        //阻止默认行为
        event.preventDefault()
        let username = $('.reg-box [name="username"]').val()
        let password = $('.reg-box [name="password"]').val()
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username,
                password
            },
            success: (data) => {
                if(data.status==1) {
                    return layer.msg(data.message)
                }
                layer.msg('注册成功，请登录')
                //模拟跳转
                $('.item_login').click()
            }
        })
    })
    //监听登录
    $('.login-box').on('submit',function(e){
        var e=e || window.e
        e.preventDefault()
        //获取用户名
        let username=$('.login-box [name="username"]').val()
        //获取密码
        let password=$('.login-box [name="password"]').val()
        $.ajax({
            method:'post',
            url:'/api/login',
            data:{
                username,
                password
            },
            success:(data)=>{
                if(data.status==1) {
                    //设置弹出层，返回信息
                    return layer.msg(data.message)
                }
                console.log(data);
                localStorage.setItem('token',data.token)
                window.location.href="../html/index.html"
            }
        })
    })
})