
const fs = require('fs')
async function upload(ctx) {
    // // 设置上传目录
    let d = new Date()
    let dateDir = `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}/`
    let fileDir = `static/${dateDir}`;
    
    // 创建目录
    await fs.promises.mkdir(fileDir, { recursive: true })
    let file = ctx.request.files.file
    console.log(file)
    let fileName = Date.now() + file.name
    // 将文件从临时目录移动到我们指定的目录
    await fs.promises.rename(file.path, fileDir + fileName)
    ctx.body = {
        code: 1,
        msg: '上传成功',
        data: {
            url: dateDir+fileName,
            name: file.name
        }
    }
}

module.exports = {
    upload
}