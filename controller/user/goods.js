const db = require('../../db')
async function goodsList(ctx) {
    // console.log(ctx.query)
    let page = parseInt(ctx.query.page) || 1
    let num = parseInt(ctx.query.num) || 2
    let cid = parseInt(ctx.query.cid) || null
    let filterType = parseInt(ctx.query.filterType) || 0
    let searchValue = ctx.query.searchValue || ''
    let order = ' order by id'
    switch (filterType) {
        case 0:
            order = 'order by sku_id'
            break;
        case 1:
            order = 'order by sku_id desc'
            break;
        case 2:
            order = 'order by price'
            break;
        case 3:
            order = 'order by price desc'
            break;
        case 4:
            order = 'order by stock desc'
            break;
    }
    // console.log(order)
    let where = 'where 1'
    if (cid && !searchValue) {
        where = where + ` AND goods.category_id=${cid}`
    }
    if (searchValue) {
        where = where + ` AND name like '%${searchValue}%'`
    }
    let sql = `select goods.*,sku.id as sku_id,sku.price,sku.stock,sku.marketPrice,sku.costPrice,sku.specs,sku.goods_id from goods join sku on goods.id=sku.goods_id ${where} ${order} limit ?,?`
    // console.log(sql)
    let offset = (page - 1) * num
    let [result] = await db.query(sql, [offset, num])
    // console.log(result)
    if (result.length) {
        ctx.body = { code: 1, msg: '查找成功', data: result }
    } else {
        ctx.body = { code: 0, msg: '查找失败', data: null }

    }
}


async function searchGoods(ctx) {
    if (!ctx.query.searchValue) {
        ctx.body = { code: 0, msg: '查找失败', data: null }
    }
    let [result] = await db.query(`select goods.*,sku.id as sku_id,sku.price,sku.stock,sku.marketPrice,sku.costPrice,sku.specs,sku.goods_id from goods join sku on goods.id=sku.goods_id where name like '%${ctx.query.searchValue}%'`)
    if (result.length) {
        ctx.body = { code: 1, msg: '查找成功', data: result }
    } else {
        ctx.body = { code: 0, msg: '查找失败', data: null }
    }
}

module.exports = {
    goodsList,
    searchGoods
}