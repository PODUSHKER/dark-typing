const express = require('express')
const apiRouter = express.Router()
const apiControllers = require('../controllers/apiControllers.js')

apiRouter.post('/saveResult', apiControllers.saveResult)
apiRouter.post('/getTypingText', apiControllers.getTypingText)
apiRouter.post('/sendMessage', apiControllers.sendMessage)


module.exports = apiRouter