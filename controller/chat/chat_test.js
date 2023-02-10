const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);











async function test(ctx) {
    let input = ctx.request.query.input
    if (!input) {
        ctx.body = { code: 0, msg: '请输入有效值', response: '' }
    }
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input,
        max_tokens: 2048,
        temperature: 0,
      });
    ctx.body = { code: 1, msg: '成功', response: response.data }
}





module.exports = {
    test
}