const db = require('../../db')

async function addAddress(ctx) {
    try {
        let content = ctx.request.body
        let data = [ctx.user.id, content.name, content.tel, content.city, content.county, content.country, content.province, content.isDefault, content.postalCode, content.addressDetail]
        await db.query('INSERT INTO user_address(u_id,name,tel,city,county,country,province,isDefault,postalCode,addressDetail) values (?,?,?,?,?,?,?,?,?,?)', data)
        ctx.body = { code: 1, msg: '添加成功', data: null }

    } catch (error) {
        console.log(error)
        ctx.body = { code: 0, msg: '添加失败', data: null }
    }
}


async function selectAddress(ctx) {
    // console.log(1515)
    let [result] = await db.query('select * from user_address where u_id=? order by id desc,isDefault desc',[ctx.user.id])
    console.log(result)
    for (const [item,index] of result.entries()) {
        if (index) {
       
        }
    }
    ctx.body = { code: 0, msg: '您还没有地址', data: null }
}
module.exports = {
    addAddress,
    selectAddress
}