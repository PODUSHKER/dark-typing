const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const hbsConfig = require('./utils/hbsConfig.js')
const staticFilesPath = path.join(__dirname + '/public')
const generalRoutes = require('./routes/generalRoutes.js')
const cookieParser = require('cookie-parser')
const authChecker = require('./utils/authChecker.js')
const apiRoutes = require('./routes/apiRoutes.js')
const http = require('http')
const server = new http.createServer(app)
const io = require('socket.io')(server)
const {sequelize} = require('./utils/dbSettings.js')

dotenv.config()

app.use(express.static(staticFilesPath))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())


app.set('view engine', 'hbs')
app.set('views', 'templates')
app.engine('hbs', hbsConfig)



async function main() {
    try {
        await sequelize.sync()
        io.on('connection', async (socket) => {
            socket.on('showMessage', (data) => {
                socket.broadcast.emit('showMessage', data)
            })
            socket.on('updateLeaderboard', (results) => {
                socket.broadcast.emit('updateLeaderboard', results)
            })
            socket.on('showNewRecord', (data) => {
                socket.broadcast.emit('showNewRecord', data)
            })
        })

        server.listen(80, process.env.IP_ADDRESS, () => console.log('server start!'))

        app.use(authChecker)

        app.use('/', generalRoutes)
        app.use('/api', apiRoutes)
    }
    catch (err) {
        console.log(err)
    }
}
main()


process.on('SIGINT', async () => {
    await sequelize.close()
    process.exit()
})

process.on('uncaughtException', async (err) => {
    console.log(err)
})