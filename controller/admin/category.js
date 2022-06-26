const db = require('../../db')
const { toTree } = require('../../tools')


async function addCategory(ctx) {
    console.log(ctx.request.body)
    let name = ctx.request.body.name
    let pid = ctx.request.body.pid || 0
    let thumb = ctx.request.body.thumb || ''
    if (!name || name.length < 1 || name.length > 10) {
        return ctx.body = { code: 2, msg: '请输入正确格式的分类名称', data: null }
    }
    let [result] = await db.query('insert into category (name,pid,thumb) values (?,?,?)',
        [name, pid, thumb])
    if (result.affectedRows) {
        ctx.body = { code: 1, msg: '添加成功', data: null }
    } else {
        ctx.body = { code: 0, msg: '添加失败', data: null }

    }
}


async function listCategory(ctx) {
    let filed = ctx.request.query.name || ''
    let [result] = await db.query('select * from category')
    if (filed) {
        for (let index = 0; index < result.length; index++) {
            result[index][filed] = result[index].name
            delete result[index].name
        }
    }
    if (result) {
        ctx.body = { code: 1, msg: '查询成功', data: toTree(result) }

    } else {
        ctx.body = { code: 0, msg: '查询失败', data: null }
    }

}

module.exports = {
    addCategory,
    listCategory,
}