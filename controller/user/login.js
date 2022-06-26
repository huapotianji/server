const { checkMoblie, createNum, sendSms, checkLogin, createStr } = require('../../tools')
const db = require('../../db')
async function addUser(ctx) {
    // console.log(ctx.request.query)
    let mobile = ctx.request.query.mobile
    if (!checkMoblie(mobile)) {
        return { code: 0, msg: '您输入的手机号格式有误', data: null }
    }
    // // 生成6位验证码
    let context = createNum(100000, 688888)
    // // 生效时间为10分钟
    let expire = Date.now() + 10 * 60000
    let [result] = await db.query('insert into sms_code (mobile,context,expire,type) values (?,?,?,?)', [mobile, context, expire, 1])
    if (!result.insertId) {
        return ctx.body = { code: 0, msg: '发送失败', data: null }
    }
    let res = await sendSms(mobile, context)
    console.log(res.SendStatusSet[0].Code)
    if (res.SendStatusSet[0].Code == 'Ok') {
        ctx.body = { code: 1, msg: '发送成功，请注意接收', data: null }
    } else {
        ctx.body = { code: 0, msg: '发送失败', data: null }
    }
}




// async function login(ctx) {
//     // 拿到最新的数据
//     let [[result]] = await db.query('select * from sms_code where mobile=? AND type=? order by id desc', [ctx.request.body.mobile, 1])
//     let [[{ id }]] = await db.query('select id from user where mobile=?', [ctx.request.body.mobile])
//     // console.log(id)
//     let res = checkLogin(result, ctx, id)
//     // console.log(res)
//     if (res.code) {
//         // 注册之前可以通过手机号查重
//         let [result] = await db.query('select * from user where mobile=?', [ctx.request.body.mobile])
//         // 自动注册成会员
//         if (!result.length) {
//             let data = [createStr(10), createStr(11), createStr(10), createNum(0, 1), ctx.request.body.mobile]
//             let [result1] = await db.query('insert into user (username,password,nickname,sex,mobile) values (?,?,?,?,?)', data)
//         }
//     }
// }

// 登录测试成功
async function login(ctx) {
    console.log(ctx.request.body)
    if (!ctx.request.body || !ctx.request.body.username || ctx.request.body.username.length < 5 || ctx.request.body.username.length > 20) {
        return ctx.body = { code: 2, msg: '请输入正确格式的账号', data: null }
    }

    if (!ctx.request.body || !ctx.request.body.password || ctx.request.body.password.length < 5 || ctx.request.body.password.length > 16) {
        return ctx.body = { code: 2, msg: '请输入正确格式的密码', data: null }
    }
    let [[result]] = await db.query('SELECT * FROM user_login where username=?', [ctx.request.body.username])
    if (!result) {
        return ctx.body = { code: 0, msg: '登陆失败，请先成为会员', data: null }
    }
    if (result.password == ctx.request.body.password) {
        // 设置token
        let token = jwt.sign(
            // 参数1：载荷信息
            {
                id: 1,
                username: ctx.request.body.username,
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
            },
            // 参数2：密钥信息
            '666666'
            // 参数3：配置信息（可选参数）
        )
        ctx.body = { code: 1, msg: '登陆成功', data: token }
    } else {
        ctx.body = { code: 0, msg: '密码错误', data: null }
    }
}

async function selectUser(ctx) {
    let username = ctx.token.username
    let [[result]] = await db.query('SELECT * FROM user_login where username=?', [username])
    if (result) {
        ctx.body = { code: 1, msg: '查询成功', data: result }
    } else {
        ctx.body = { code: 0, msg: '查询失败', data: null }
    }
}

async function updatePassword(ctx) {
    let password = ctx.request.body.password
    let newPassword = ctx.request.body.newPassword
    let [[result]] = await db.query('SELECT * FROM user_login where password=?', [password])
    if (result) {
        let [[result1]] = await db.query('update FROM user_login set password=? where password=?', [newPassword,password])
        if (result1.affectedRows) {
            ctx.body = { code: 1, msg: '修改成功', data: null }
        } else {
            ctx.body = { code: 2, msg: '修改失败', data: null }
        }
    } else {
        ctx.body = { code: 0, msg: '原始密码错误', data: null }
    }
}

module.exports = {
    addUser,
    login,
    selectUser,
    updatePassword
}