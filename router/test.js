const Router = require("koa-router")
const router = new Router()
const index = require("../controller/index")

router.get('/test',index.test)
module.exports = router