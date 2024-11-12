const { User } = require('../models/associations.js')
const jwt = require('jsonwebtoken')


async function authChecker(request, response, next) {
    if (request.cookies['token']) {
        console.log('im here')
        console.log(request.cookies['token'])
        const token = request.cookies['token'].split(' ')[1];
        const userId = jwt.verify(token, process.env.SECRET)['id']
        const user = await User.findOne({ where: { id: userId } })
        request.body['userId'] = userId;
        response.locals['User'] = user;
    }
    next()
}

module.exports = authChecker