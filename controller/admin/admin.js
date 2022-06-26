const db = require('../../db')
const jwt = require('jsonwebtoken')


// 登录测试成功
async function login(ctx) {
    console.log(ctx.request.body)
    if (!ctx.request.body || !ctx.request.body.username || ctx.request.body.username.length < 5 || ctx.request.body.username.length > 20) {
        return ctx.body = { code: 2, msg: '请输入正确格式的账号', data: null }
    }

    if (!ctx.request.body || !ctx.request.body.password || ctx.request.body.password.length < 5 || ctx.request.body.password.length > 16) {
        return ctx.body = { code: 2, msg: '请输入正确格式的密码', data: null }
    }
    let [[result]] = await db.query('SELECT * FROM admin_login where username=?', [ctx.request.body.username])
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

async function addAdmin(ctx) {
    if (!ctx.request.body || !ctx.request.body.username || ctx.request.body.username < 5 || ctx.request.body.username.length > 20) {
        return ctx.body = { code: 2, msg: '请输入正确格式的账号', data: null }
    }
    let [result] = await db.query('INSERT INTO admin(username,password,nickname,sex,phone,remarks) VALUES(?,?,?,?,?,?)',
        [ctx.request.body.username, ctx.request.body.password, ctx.request.body.nickname, ctx.request.body.sex, ctx.request.body.phone, ctx.request.body.remarks])
    if (result.affectedRows) {
        ctx.body = { code: 1, msg: '添加成功', data: null }
    } else {
        ctx.body = { code: 0, msg: '添加失败', data: null }
    }
}



// 会员列表
async function listAdmin(ctx) {
    console.log(ctx.request.query)
    let pNum = ctx.request.query.pNum
    let pageSize = ctx.request.query.pageSize - 0
    let pNums = (pNum - 1) * pageSize
    if (pNum && pageSize) {
        let [total] = await db.query('SELECT * FROM user_login')
        let [result] = await db.query(' select * from user_login limit ?,?', [pNums, pageSize])
        if (result) {
            ctx.body = { code: 1, msg: "查询成功", data: result, total: total.length }
        }
        else {
            ctx.body = { code: 0, msg: "查询失败", data: null }
        }
    } else {
        ctx.body = { code: 0, msg: "查询失败", data: null }
    }
}


module.exports = {
    login,
    addAdmin,
    listAdmin,
}