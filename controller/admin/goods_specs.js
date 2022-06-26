const db = require('../../db')

async function addGoodsSpecs(ctx) {
    if (!ctx.request.body) {
        return ctx.body = { code: 2, msg: '您输入的内容为空', data: null }
    }

    // 要做数据验证
    let name = ctx.request.body.name
    let type = ctx.request.body.type
    let category_id = ctx.request.body.category_id
    let presetVal = ctx.request.body.presetVal

    presetVal = JSON.stringify(presetVal)
    // 数据库操作
    let [result] = await db.query('insert into goods_specs (name,type,category_id,val) values(?,?,?,?)',
        [name, type, category_id, presetVal])
    if (result.affectedRows) {
        ctx.body = { code: 1, msg: '添加成功', data: null }
    } else {
        ctx.body = { code: 0, msg: '添加失败', data: null }
    }

}

async function listGoodsSpecs(ctx) {
    if (!ctx.request.query || !ctx.request.query.category_id) {
        return ctx.body = { code: 2, msg: '该分类id不存在', data: null }
    }
    let [result] = await db.query('select * from goods_specs where category_id=?', [ctx.request.query.category_id])
    if (result) {
        ctx.body = { code: 1, msg: '查询成功', data: result }
    } else {
        ctx.body = { code: 0, msg: '该分类下无规格', data: null }
    }
}

module.exports = {
    addGoodsSpecs,
    listGoodsSpecs
}