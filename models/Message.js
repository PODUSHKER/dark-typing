const mongoose = require('mongoose')
const User = require('./User.js')

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    text: String
}, {timestamps: true})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;