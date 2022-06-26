const db = require('../../db')

async function addGoods(ctx) {
    let basicForm = ctx.request.body.basicForm
    let basicImgs = ctx.request.body.basicImgs
    let goodsSpecs = ctx.request.body.goodsSpecs
    let goodsDetails = ctx.request.body.goodsDetails
    // 进行数据验证


    try {
        // 基本信息上传
        basicForm.category_id = basicForm.category_id[basicForm.category_id.length - 1]
        let [result] = await db.query('insert into goods (name,brand,thumb,category_id) values (?,?,?,?)',
            [basicForm.name, basicForm.brand, basicForm.thumb, basicForm.category_id])

        // // 相册集上传
        if (basicImgs && basicImgs.length && result.insertId) {
            let sql = 'insert into goods_imgs (url,goods_id) values '
            for (let index = 0; index < basicImgs.length; index++) {
                const element = basicImgs[index].response.data.url
                sql += `('${element}','${result.insertId}'),`
            }
            // 删除sql语句的最后一个字符并入库
            let [res] = await db.query(sql.slice(0, -1))
        }


        // goodsSpecs的数据上传
        if (result.insertId) {
            for (let i = 0; i < goodsSpecs.length; i++) {
                const item = goodsSpecs[i];
                let [res1] = await db.query('insert into sku (price,stock,marketPrice,costPrice,specs,goods_id) values (?,?,?,?,?,?)',
                    [item.price, item.stock, item.sPrice, item.cPrice, JSON.stringify(item.specs), result.insertId])
            }
        }

        //商品详情入库
        await db.query('insert into goods_details (content,goods_id) values (?,?)',
            [goodsDetails, result.insertId])
        ctx.body = { code: 1, msg: '添加成功', data: null }

    } catch (error) {
        console.log(error)
        ctx.body = { code: 0, msg: '添加失败', data: null }
    }
}


async function goodsList(ctx) {
    let where = 'where 1'
    if (ctx.request.query.category_id) {
        where += ` AND category_id=${ctx.request.query.category_id}`
    }
    if (ctx.request.query.search) {
        where += ` AND goods.name like "%${ctx.request.query.search}%"`
    }
    if (ctx.request.query.category_id && ctx.request.query.search) {
        where += ` AND category_id=${ctx.request.query.category_id} AND goods.name like "%${ctx.request.query.search}%" `
    }

    let [goods] = await db.query(`select goods.id,goods.name,goods.brand,goods.thumb,goods.state,category.name as category_name from goods join category on goods.category_id=category.id ${where}`)
    if (goods.length > 0) {
        for (let index = 0; index < goods.length; index++) {
            const goods_id = goods[index].id;
            let [sku] = await db.query('select * from sku where goods_id=?', [goods_id])
            for (let i = 0; i < sku.length; i++) {
                const item = sku[i];
                item.specs = JSON.parse(item.specs)
            }
            goods[index].sku = sku
        }
        ctx.body = { code: 1, msg: '查询成功', data: goods }
    } else {
        ctx.body = { code: 0, msg: '查询失败', data: null }
    }
}

async function mode(ctx) {
    console.log(ctx.request.body)
    // ctx.body = 666
    if (!ctx.request.body || !ctx.request.body.id) {
        return ctx.body = { code: 0, msg: '修改失败', data: null }
    }
    let [result] = await db.query('update goods set state=? where id=?', [ctx.request.body.state, ctx.request.body.id])
    if (result.affectedRows) {
        ctx.body = { code: 1, msg: '修改成功', data: null }
    }else{
        ctx.body = { code: 0, msg: '修改失败', data: null }
    }
}
module.exports = {
    addGoods,
    goodsList,
    mode
}