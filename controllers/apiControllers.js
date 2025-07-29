const { Op } = require('sequelize')
const { User, Message, Result } = require('../models/associations.js')
const fs = require('fs').promises
const path = require('path')

exports.saveResult = async (request, response) => {
    try {
        const { ...data } = request.body
        const user = response.locals['User']
        const result = await new Result({ ...data, UserId: user.id }).save()
        let topData = null;

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const top1 = [...await Result.findAll({
            where: {
                createdAt: {
                    [Op.gte]: twentyFourHoursAgo
                }
            },
            include: [{
                model: User,
            }],
            order: [['speed', 'DESC']], // Сортируем по скорости (по убыванию)
            limit: 1, // Ограничиваем 10 результатами
            raw: true, // Для простого JSON вывода
            nest: true
        })][0]

        if (top1.id === result.id) {
            topData = {
                speed: top1.speed,
                username: top1.User.username,
            }
        }
        const userResults = await Result.findAll({ where: { UserId: user.id } })
        const averageSpeed = +((userResults.reduce((acc, el) => acc += el.speed, 0) / userResults.length).toFixed(0));
        const averageAccuracy = +((userResults.reduce((acc, el) => acc += el.accuracy, 0) / userResults.length).toFixed(1));

        user.averageAccuracy = averageAccuracy;
        user.averageSpeed = averageSpeed;


        await user.save()
        response.json({ success: true, updatedStats: { averageSpeed, averageAccuracy }, topData })
    }
    catch (err) {
        
    }
}



exports.sendMessage = async (request, response) => {
    try {
        const { message: text } = request.body;
        await Message.create({ UserId: request.body['userId'], text })
        return response.json({ username: response.locals['User'].username })
    }
    catch (err) {
    }
}


exports.getResults = async (request, response) => {
    try {
        // Рассчитываем дату 24 часа назад
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Получаем топ-10 результатов
        const results = [...await Result.findAll({
            where: {
                createdAt: {
                    [Op.gte]: twentyFourHoursAgo
                }
            },
            include: [{
                model: User,
            }],
            order: [['speed', 'DESC']], // Сортируем по скорости (по убыванию)
            limit: 10, // Ограничиваем 10 результатами
            raw: true, // Для простого JSON вывода
            nest: true
        })].reduce((acc, el) => acc.map(el => el.User.username).includes(el.User.username) ? acc : [...acc, el], [])
        

        // Добавляем ранги к результатам
        const rankedResults = results.map((result, index) => ({
            rank: index + 1,
            username: result.User.username,
            speed: result.speed,
            language: result.language,
            date: new Date(result.createdAt).toLocaleDateString(),
            accuracy: result.accuracy
        }));

        return response.json({ results: rankedResults });
    }
    catch (err) {
        console.error('Error fetching results:', err);
        return response.status(500).json({ error: 'Internal server error' });
    }
};
