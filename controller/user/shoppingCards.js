const db = require('../../db')

async function addShopping(ctx) {
    let sku_id = parseInt(ctx.query.sku_id)
    let num = parseInt(ctx.query.num)
    // TODO数据验证
    // let [[{goods_id}]] = await db.query('select goods_id from sku where id=?', [sku_id])
    // console.log(goods_id)
    let [[{ id }]] = await db.query('select id from user where mobile=?', [ctx.user.username])
    if (!id) {
        return ctx.body = { code: 0, msg: '添加失败', data: null }
    }
    let [[res]] = await db.query('select * from shoppingCards where sku_id=?', [sku_id])
    console.log(res)
    if (!res) {
        let [result] = await db.query('insert into shoppingCards (uid,sku_id,num) values(?,?,?)', [id, sku_id, num])
        if (result.affectedRows) {
            ctx.body = { code: 1, msg: '添加成功', data: null }
        } else {
            ctx.body = { code: 0, msg: '添加失败', data: null }
        }
    } else {
        let [result] = await db.query('update shoppingCards set num=num+? where sku_id=?', [num, sku_id])
        if (result.affectedRows) {
            ctx.body = { code: 1, msg: '添加成功', data: null }
        } else {
            ctx.body = { code: 0, msg: '添加失败', data: null }
        }
    }
}

async function selectShoppingCards(ctx) {
    let [[{ id }]] = await db.query('select id from user where mobile=?', [ctx.user.username])
    if (id) {
        let [shoppingCards] = await db.query('select * from shoppingCards where  uid=?', [id])
        if (!shoppingCards.length) {
            ctx.body = { code: 0, msg: '查找失败', data: null }
        } else {
            let sku_id = []
            // let [[{ goods_id }]] = await db.query('select goods_id from sku where id=?', [sku_id])
            // console.log(goods_id)
            // let [[goodsInfo]] = db.query('select * from goods where id=?', [goods_id])
            // console.log(goodsInfo)
            for (const it of shoppingCards) {
                sku_id.push(it.sku_id)
            }
            // console.log(sku_id)
            // let sql = `select goods_id from sku where id in (${sku_id})`
            // console.log(sql)
            let [skuRaw] = await db.query('select * from sku where id in (?)', [sku_id])
            let goods_idArr = []
            let skus = {}
            for (const it of skuRaw) {
                it.specs = JSON.parse(it.specs)
                skus[it.id] = it
                goods_idArr.push(it.goods_id)
            }
            let goods = {}
            let [goodsInfo] = await db.query('select * from goods where id in (?)', [goods_idArr])
            for (const it of goodsInfo) {
                goods[it.id] = it
            }

            for (const it of shoppingCards) {
                it.goods_info = goods[skus[it.sku_id].goods_id]
                it.sku = skus[it.sku_id]
            }
            ctx.body = { code: 1, msg: '查找成功', data: shoppingCards }
        }
    }
}

async function modeNum(ctx) {
    // console.log(ctx.request.body)
    let sku_id = ctx.request.body.sku_id
    let num = ctx.request.body.num
    if (!sku_id) {
        return ctx.body = { code: 0, msg: '修改失败', data: null }
    }
    let [result] = await db.query('update shoppingCards set num=? where sku_id=?', [num, sku_id])
    if (result.affectedRows) {
        ctx.body = { code: 1, msg: '修改成功', data: null }
    } else {
        ctx.body = { code: 0, msg: '修改失败', data: null }

    }
}

module.exports = {
    addShopping,
    selectShoppingCards,
    modeNum,
}