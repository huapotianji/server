const Router = require("koa-router")
const router = new Router()

// 用户登录后
const login = require('../controller/user/login')
// 用户注册
router.get('/addUser', login.addUser)
// 用户登录
router.post('/login', login.login)
// 用户查询
router.post('/selectUser',login.selectUser)
// 更新密码
router.post('/updatePassword',login.updatePassword)




// 分类页
const category = require("../controller/admin/category")
router.get('/admin/getCategory', category.listCategory)


// 获得商品列表
const userGoods = require('../controller/user/goods')
router.get('/getGoodsList', userGoods.goodsList)
router.get('/fuzzySearch', userGoods.searchGoods)

// 获取商品规格
const goodsSpecs = require('../controller/user/goodsSpecs')
router.get('/selectGoodsSpecs', goodsSpecs.selectGoodsSpecs)

// 添加购物车
const shopping = require('../controller/user/shoppingCards')
router.get('/addShopping', checkToken, shopping.addShopping)
// 查询购物车里的东西
router.get('/selectShoppingCards', checkToken, shopping.selectShoppingCards)
router.put('/selectShoppingCards', checkToken, shopping.modeNum)
// 有关地址的操作
const address = require('../controller/user/address')
router.post('/addAddress', checkToken, address.addAddress)
router.get('/selectAddress', checkToken, address.selectAddress)
const jwt = require('jsonwebtoken')
async function checkToken(ctx, next) {
    let url = new URL(ctx.request.url, 'http://www.xx.com')
    // console.log(url)
    let notAuthentication = ['/addUser', '/login']
    if (notAuthentication.includes(url.pathname)) {
        await next()
    } else {
        try {
            let jwtInfo = jwt.verify(ctx.header.token, 'sdkglhjdksfghsdfhs')
            ctx.user = {
                id: jwtInfo.id,
                username: jwtInfo.username
            }
            await next()
        } catch (error) {
            ctx.status = 401
        }
    }
}
module.exports = router