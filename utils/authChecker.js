const { User, Message } = require('../models/associations.js')
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')


async function authChecker(request, response, next) {
    if (request.cookies['token']) {
        
        
        const token = request.cookies['token'].split(' ')[1];
        const data = jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                response.clearCookie('token')
                return next()
            }
            return decoded
        })
        const userId = data['id']
        const user = await User.findOne({ where: { id: userId } })

        request.body['userId'] = userId;
        response.locals['User'] = user;
    }
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = [...await Message.findAll({
        where: {
            createdAt: {
                [Op.gte]: twentyFourHoursAgo
            }
        },
        include: [{
            model: User,
        }],
        order: [['createdAt', 'DESC']], // Сортируем по скорости (по убыванию)
        limit: 25, // Ограничиваем 10 результатами
        raw: true, // Для простого JSON вывода
        nest: true
    })].reverse()
    response.locals['messages'] = messages;
    next()
}

module.exports = authChecker