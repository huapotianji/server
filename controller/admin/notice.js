const db = require('../../db')
const momont = require('moment')
//添加公告
async function addNotice(ctx) {
    let content = ctx.request.body.content
    let time = momont
    let [result] = await db.query('insert into notice (date,content) values (?,?)',
        [time, content])
    if (result) {

    }
}

// 公告列表
async function listNotice(ctx) {
    let [result] = await db.query('select * from notice')
    if (result) {
        ctx.body = { code: 1, msg: '查询成功', data: result }
    } else {
        ctx.body = { code: 1, msg: '查询失败', data: null }

    }
}
// 删除公告
async function deleteNotice(ctx) {
    let id = ctx.request.body.id
    let [[result]] = await db.query('delete from notice where id=?', [id])
    if (result) {
        ctx.body = { code: 1, msg: '删除成功', data: null }

    } else {
        ctx.body = { code: 0, msg: '删除失败', data: null }
    }
}

module.exports = {
    addNotice,
    listNotice,
    deleteNotice
}
