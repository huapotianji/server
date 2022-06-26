const db = require('../../db')

async function selectGoodsSpecs(ctx) {
    let id = ctx.query.id
    let sku_id = ctx.query.sku_id
    if (!id || !sku_id) {
        return ctx.body = { code: 0, msg: '该商品不存在', data: null }
    }
    // 此处应该加上是否已将上架,此搜索为某个商品的信息
    let [[good]] = await db.query('select * from goods where id=?', [id])
    // 搜索该商品的轮播图的照片
    let [imgs] = await db.query('select * from goods_imgs where goods_id=?', [id])
    let imgsLength = imgs.length
    // 搜索已存在的商品规格组合sku
    let [skusRaw] = await db.query('select * from sku where goods_id=?', [id])
    for (const it of skusRaw) {
        it.specs = JSON.parse(it.specs)
    }
    // 获取当前的商品规格
    let [[currentSku]] = await db.query('select * from sku where id=?', [sku_id])
    currentSku.specs = JSON.parse(currentSku.specs)
    good.imgs = imgs
    good.imgsLength = imgsLength
    good.skusRaw = skusRaw
    good.currentSku = currentSku
    ctx.body = { code: 1, msg: '查找成功', data: good }
}

module.exports = {
    selectGoodsSpecs
}