const koa = require("koa")
const app = new koa()

const serve = require('koa-static');
app.use(serve('static'));


const koaBody = require("koa-body")
app.use(koaBody({
    // 支持multipart-formdata 的表单
    multipart: true,
    formidable: {
        // 指定上传后的文件存放目录
        uploadDir: './static',
        // 保持文件原有的后缀名
        keepExtensions: true
    }
}));

const cors = require('koa2-cors')
app.use(cors())

// 注册路由
const test = require("./router/test")
app
    .use(test.routes())
    .use(test.allowedMethods());

const router_user = require('./router/user_router')
app
    .use(router_user.routes())
    .use(router_user.allowedMethods());
const chatgpt = require("./router/chatgpt_router")
app
    .use(chatgpt.routes())
    .use(chatgpt.allowedMethods());
app.listen(3015, function () {
    console.log("服务器运行中")
})