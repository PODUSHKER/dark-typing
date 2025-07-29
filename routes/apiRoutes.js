const express = require('express')
const apiRouter = express.Router()
const apiControllers = require('../controllers/apiControllers.js')

apiRouter.post('/saveResult', apiControllers.saveResult)
apiRouter.post('/sendMessage', apiControllers.sendMessage)
apiRouter.post('/getResults', apiControllers.getResults)


module.exports = apiRouter