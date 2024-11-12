const Result = require('../models/Result.js')
const User = require('../models/User.js')
const Message = require('../models/Message.js')
const fs = require('fs').promises
const path = require('path')

exports.saveResult = async (request, response) => {
    try{
        const {userId, ...data} = request.body
        const user = await User.findById(userId)
        const result = await Result({...data, user: userId}).save()
        user.results.push(result)
        await user.save()
        const results = (await Result.find({}).populate('user').exec()).sort((a, b) => b.speed - a.speed)
        let formatResults = results.reduce((acc, el) => acc.map(el => String(el.user)).includes(String(el.user)) ? acc : [...acc, el], [])
        formatResults = formatResults.length > 10 ? formatResults.slice(0, 10) : formatResults;
        response.json({results: formatResults})
    }
    catch(err){
        console.log(err)
    }
}

exports.getTypingText = async (request, response) => {
    try{
        console.log(request.body['lang'])
        const text = await fs.readFile(path.join(process.env.APP_DIR, `public/text/${request.body['lang']}.txt`))
        const typingTexts = text.toString().split(/[\n\r]/g).filter(el => el.length)
        const randIndex = Number(String(Math.random()).slice(2, 4))%typingTexts.length
        const typingText = typingTexts[randIndex]
        response.json({typingText})
    }
    catch(err){
        console.log(err)
    }
}


exports.sendMessage = async (request, response) => {
    try{
        const {from, text} = request.body;
        await Message.create({from, text})
        console.log('im here')
        response.end()
    }
    catch(err){
        console.log(err)
    }
}