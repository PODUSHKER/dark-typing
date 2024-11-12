const User = require('../models/User.js')
const jwt = require('jsonwebtoken')


async function authChecker(request, response, next){
    try{
        if (request.cookies['token']){
            const token = request.cookies['token'].split(' ')[1];
            const userId = jwt.verify(token, process.env.SECRET)['_id']
            const user = await User.findById(userId)
            request.body['userId'] = userId;
            response.locals['user'] = user;
        }
        next()
    }
    catch(err){
        console.log(err)
    }
}

module.exports = authChecker