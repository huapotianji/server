const Router = require("koa-router")
const router = new Router()
// 管理员信息处理
const admin = require("../controller/admin/admin")
// 管理员登陆处理
router.post("/admin/login", admin.login)
// 添加管理员
router.post('/admin/addAdmin', admin.addAdmin)
//管理员列表
router.get('/admin/listUser', admin.listAdmin)







// 商品分类处理
const category = require("../controller/admin/category")
// 添加商品分类
router.post("/admin/addCategory", checkToken, category.addCategory)
// 分类列表
router.get('/admin/listCategory', checkToken, category.listCategory)

// 文件上传处理
const upload = require('../controller/admin/upload')
// 文件上传
router.post("/admin/upload", checkToken, upload.upload)

// 商品信息处理
const goods = require('../controller/admin/goods')
router.post("/admin/addGoods", checkToken, goods.addGoods)
router.get('/admin/goodsList', checkToken, goods.goodsList)
router.post('/admin/goodsUpdate', checkToken, goods.mode)

// 商品规格信息处理
const specs = require('../controller/admin/goods_specs')
router.post("/admin/addGoodsSpecs", checkToken, specs.addGoodsSpecs)
router.get("/admin/listGoodsSpecs", checkToken, specs.listGoodsSpecs)
// 路由中间件的使用
const jwt = require('jsonwebtoken')
async function checkToken(ctx, next) {
    let url = new URL(ctx.request.url, 'http://www.xx.com')
    // console.log(url)
    let notAuthentication = ['/admin/login']
    if (notAuthentication.includes(url.pathname)) {
        await next()
    } else {
        try {
            let jwtInfo = jwt.verify(ctx.header.token, '666666')
            ctx.admin = {
                id: jwtInfo.id,
                username: jwtInfo.username
            }
            await next()
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = router