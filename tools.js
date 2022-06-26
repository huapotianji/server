/**
 * 将数组数据转化为树形结构
 * @param {*} data 
 * @param {*} pid 
 * @returns 
 */

function toTree(data, pid = 0) {
    let sonArr = []
    for (const it of data) {
        if (it.pid == pid) {
            let son = toTree(data, it.id)
            if (son.length) {
                it.children = son
            }
            sonArr.push(it)
        }
    }
    return sonArr
}


/**
 * 发送短信
 * 第一个参数为手机号mobile
 * 第二个参数为验证码context
 * 第三个参数为多少分钟minute
 */

async function sendSms(mobile, context, minute = 10) {
    if (Array.isArray(mobile)) {
        if (!mobile.length) {
            return { code: 0, msg: '您输入的手机号有误', data: null }
        }
    } else {
        mobile = [mobile]
        if (!mobile.length) {
            return { code: 0, msg: '您输入的手机号有误', data: null }
        }
    }

    const tencentcloud = require("tencentcloud-sdk-nodejs")

    // 导入对应产品模块的client models。
    const smsClient = tencentcloud.sms.v20210111.Client

    /* 实例化要请求产品(以sms为例)的client对象 */
    const client = new smsClient({
        credential: {
            /* 必填：腾讯云账户密钥对secretId，secretKey。
             * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
             * 你也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
             * 以免泄露密钥对危及你的财产安全。
             * CAM密匙查询: https://console.cloud.tencent.com/cam/capi */
            secretId: 'AKIDYu0pPhjTx94i5AyVlkSt4ze18zauxiDQ',
            secretKey: 'xd3C4fz2oJXVCckcDXbPwCAqGPHrBDyR',
        },
        /* 必填：地域信息，可以直接填写字符串ap-guangzhou，或者引用预设的常量 */
        region: "ap-guangzhou",
        /* 非必填:
         * 客户端配置对象，可以指定超时时间等配置 */
        profile: {
            /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
            signMethod: "HmacSHA256",
            httpProfile: {
                /* SDK默认使用POST方法。
                 * 如果你一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
                reqMethod: "POST",
                /* SDK有默认的超时时间，非必要请不要进行调整
                 * 如有需要请在代码中查阅以获取最新的默认值 */
                reqTimeout: 30,
                /**
                 * SDK会自动指定域名。通常是不需要特地指定域名的，但是如果你访问的是金融区的服务
                 * 则必须手动指定域名，例如sms的上海金融区域名： sms.ap-shanghai-fsi.tencentcloudapi.com
                 */
                endpoint: "sms.tencentcloudapi.com"
            },
        },
    })

    /* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
     * 属性可能是基本类型，也可能引用了另一个数据结构
     * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
    const params = {
        /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
        SmsSdkAppId: "1400170241",
        /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，签名信息可登录 [短信控制台] 查看 */
        SignName: "书生主页",
        /* 短信码号扩展号: 默认未开通，如需开通请联系 [sms helper] */
        ExtendCode: "",
        /* 国际/港澳台短信 senderid: 国内短信填空，默认未开通，如需开通请联系 [sms helper] */
        SenderId: "",
        /* 用户的 session 内容: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
        SessionContext: "",
        /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
         * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
        PhoneNumberSet: mobile,
        /* 模板 ID: 必须填写已审核通过的模板 ID。模板ID可登录 [短信控制台] 查看 */
        TemplateId: "245450",
        /* 模板参数: 若无模板参数，则设置为空*/
        TemplateParamSet: [context, minute],
    }

    let res = await client.SendSms(params)
    return res
    // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
    // client.SendSms(params, function (err, response) {
    //     // 请求异常返回，打印异常信息
    //     if (err) {
    //         console.log(err)
    //         return
    //     }
    //     // 请求正常返回，打印response对象
    //     console.log(response)
    // })
}
/**
 *验证前端传过来的手机号 
 */

function checkMoblie(mobile) {
    let regx = /^1[356789]\d{9}$/
    return regx.test(mobile)
}


/**
 * 随机生成多少位数字
 */
function createNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 登陆时的验证
 */
const jwt = require('jsonwebtoken')
function checkLogin(result, ctx, id) {
    // 拿到最新数据的验证
    if (!result) {
        return ctx.body = ctx.body = { code: 0, msg: '登录失败', data: null }
    }

    // 验证码是否正确
    if (result.context != ctx.request.body.context) {
        return ctx.body = { code: 0, msg: '登录失败，验证码错误', data: null }
    }

    // 验证码是否过期
    if (result.expire < Date.now()) {
        return ctx.body = ctx.body = { code: 0, msg: '登录失败,验证码已失效', data: null }
    }
    // 登陆成功设置token
    let token = jwt.sign(
        // 参数1：载荷信息
        {
            id: id,
            iss: "海涛",
            username: ctx.request.body.mobile,
            age: 18,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        },
        // 参数2：密钥信息
        'sdkglhjdksfghsdfhs'
        // 参数3：配置信息（可选参数）
    )
    return ctx.body = { code: 1, msg: '登录成功', data: token }
}

/**
 * 随机生成字符串
 * 
 */

function createStr(length) {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=_'
    let temp = ''
    for (let index = 0; index < length; index++) {
        const element = str[createNum(0, 56)];
        temp += element
    }
    return temp
}

module.exports = {
    toTree,
    sendSms,
    checkMoblie,
    createNum,
    checkLogin,
    createStr,
}