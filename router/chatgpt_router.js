const Router = require("koa-router")
const router = new Router()
const  chat = require('../controller/chat/chat_test')
router.get('/chat_test',chat.test)

module.exports = router