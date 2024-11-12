const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const app = express()
const hbsConfig = require('./utils/hbsConfig.js')
const staticFilesPath = path.join(__dirname + '/public')
const generalRoutes = require('./routes/generalRoutes.js')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authChecker = require('./utils/authChecker.js')
const apiRoutes = require('./routes/apiRoutes.js')
const http = require('http')
const server = new http.createServer(app)
const io = require('socket.io')(server)

dotenv.config()

app.use(express.static(staticFilesPath))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())


app.set('view engine', 'hbs')
app.engine('hbs', hbsConfig)



async function main(){
    try{
        const DB_PATH = process.env.DB_PATH;
        const DB_NAME = process.env.DB_NAME
        await mongoose.connect(`mongodb://${DB_PATH}/${DB_NAME}`)

        io.on('connection', async (socket) => {
            socket.on('showMessage', (message) => {
                socket.broadcast.emit('showMessage', message)
            })
        })

        server.listen(80, process.env.IP_ADDRESS, () => console.log('server start!'))
    }
    catch(err){
        console.log(err)
    }
}
main()

app.use(authChecker)
app.use('/', generalRoutes)
app.use('/api', apiRoutes)

process.on('SIGINT', async () => {
    await mongoose.disconnect()
    console.log('server end')
    process.exit()
})