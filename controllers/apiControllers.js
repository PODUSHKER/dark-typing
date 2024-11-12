const { User, Message, Result } = require('../models/associations.js')
const fs = require('fs').promises
const path = require('path')
const { stringToArray, arrayToString } = require('../utils/toArrayHelp.js')

exports.saveResult = async (request, response) => {
    try {
        const { userId, ...data } = request.body
        const user = await User.findOne({ where: { id: userId } })
        const result = await new Result({ ...data, UserId: userId }).save()
        // TODO
        user.results = arrayToString([...stringToArray(user.results), result.id])
        //
        await user.save()
        const results = (await Result.findAll({ include: User })).sort((a, b) => b.speed - a.speed)
        let formatResults = results.reduce((acc, el) => acc.map(el => String(el.UserId)).includes(String(el.UserId)) ? acc : [...acc, el], [])
        formatResults = formatResults.length > 10 ? formatResults.slice(0, 10) : formatResults;
        console.log(formatResults)
        response.json({ results: formatResults })
    }
    catch (err) {
        console.log(err)
    }
}

exports.getTypingText = async (request, response) => {
    try {
        console.log(request.body['lang'])
        const text = await fs.readFile(path.join(process.env.APP_DIR, `public/text/${request.body['lang']}.txt`))
        const typingTexts = text.toString().split(/[\n\r]/g).filter(el => el.length)
        const randIndex = Number(String(Math.random()).slice(2, 4)) % typingTexts.length
        const typingText = typingTexts[randIndex]
        response.json({ typingText })
    }
    catch (err) {
        console.log(err)
    }
}


exports.sendMessage = async (request, response) => {
    try {
        const { from, text } = request.body;
        console.log(from)
        await Message.create({ UserId: from, text })
        console.log('im here')
        response.end()
    }
    catch (err) {
        console.log(err)
    }
}