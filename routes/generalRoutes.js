const express = require('express')
const generalRouter = express.Router()
const generalControllers = require('../controllers/generalControllers.js')

generalRouter.get('/login', generalControllers.getLogin)
generalRouter.post('/login', generalControllers.postLogin)

generalRouter.get('/register', generalControllers.getRegister)
generalRouter.post('/register', generalControllers.postRegister)

generalRouter.get('/logout', generalControllers.logout)



generalRouter.get('/', generalControllers.getMain)


module.exports = generalRouter;