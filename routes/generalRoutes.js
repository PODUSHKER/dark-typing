const express = require('express')
const generalRouter = express.Router()
const generalControllers = require('../controllers/generalControllers.js')

generalRouter.get('/login', generalControllers.getLogin)
generalRouter.post('/login', generalControllers.postLogin)

generalRouter.get('/register', generalControllers.getRegister)
generalRouter.post('/register', generalControllers.postRegister)

generalRouter.get('/logout', generalControllers.logout)

generalRouter.get('/profile', generalControllers.getProfile)

generalRouter.get('/', generalControllers.getMain)


generalRouter.get('/deliveryMail', generalControllers.getDeliveryMail)


generalRouter.get('/confirmMail/:id', generalControllers.getConfirmMail);
module.exports = generalRouter;